import { NextResponse } from "next/server";
import { contract } from "@/lib/contract";
import Product from "@/models/Product.model";
import connectDB from "@/lib/connectDB";
export async function POST(req: Request) {
    await connectDB();
    console.log("Connected to DB");
    const {tokenId} = await req.json();


    console.log("Token ID: ", tokenId);
    try{
        const [metaData, owner] = await contract.getProductDetails(tokenId);
        console.log("MetaData: ", metaData);
        console.log("Owner: ", owner);
        const productName = metaData.split(" - ")[0];
        const ProductInfo = await Product.findOne({ name: productName });
        if (!ProductInfo) {
            console.error("Product not found in database: ", productName);
            return NextResponse.json({ error: "Product not found in database" }, { status: 404 });
        }
        console.log("ProductInfo: ", ProductInfo);


        return NextResponse.json(ProductInfo, { status: 200 });

    } catch (error) {
        console.error("Error fetching NFT details: ", error);
        return NextResponse.json({ error: "Error fetching NFT details" }, { status: 500 });
    }
}