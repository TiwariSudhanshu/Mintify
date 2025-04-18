// import { NextResponse } from "next";
import { NextResponse } from "next/server";
import { contract } from "@/lib/contract";
import Product from "@/models/Product.model";
import connectDB from "@/lib/connectDB";

export async function GET(res: NextResponse) {
  try {
    await connectDB();
    console.log("Connected to DB");
    const tokenIds = await contract.getAllContractTokens();
    const formattedTokenIds = tokenIds.map((tokenId: any) =>
      tokenId.toString()
    );

    const ProductInfos = await Promise.all(
      formattedTokenIds.map(async (tokenId: string) => {
        try {
          const [metaData, owner] = await contract.getProductDetails(tokenId);
          const productName = metaData.split(" - ")[0];
          const product = await Product.findOne({ name: productName, owner: owner.toLowerCase()});
          if (!product) {
            console.warn(
              `Product not found for token ${tokenId}: ${productName}`
            );
            return null; // Skip if not found
          }

          return product;
        } catch (err) {
          console.error(`Error processing token ${tokenId}:`, err);
          return null;
        }
      })
    );
    const validProducts = ProductInfos.filter(Boolean);

    return NextResponse.json(validProducts, { status: 200 });
  } catch (e) {
    console.error("Error getting NFT: ", e);
    return NextResponse.json({ error: "Error getting NFT" }, { status: 500 });
  }
}
