import { NextResponse } from 'next/server';
import { contract } from '@/lib/contract';
import Product from '@/models/Product.model';
import cloudinary from '@/lib/cloudinary';
import connectDB from '@/lib/connectDB';
import { getAddress } from 'ethers';
export async function POST(req: Request) {
  try {
    await connectDB();
    console.log("Connected to MongoDB");
    console.log("Request: ", req.body);
    const body = await req.json();
    // console.log("Request body: ", body);
    const { recipient, name, description, price, quantity, category, image, attributes } = body;
    // console.log(`Minting NFT for ${recipient} with name ${name} and price ${price}`);
    if (!recipient || !name || !price ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Handle image upload to Cloudinary
    // let imageUrl: string;
    // try {
    //   const uploadRes = await cloudinary.uploader.upload(image, {
    //     folder: 'products',
    //   });
    //   imageUrl = uploadRes.secure_url;
    //   console.log("Image uploaded to Cloudinary:", imageUrl);
    // } catch (err) {
    //   console.error("Cloudinary upload failed:", err);
    //   return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
    // }

    // Check if product already exists
    // const existingProduct = await Product.findOne({ name, owner: recipient });
    // if (existingProduct) {
    //   console.error("Product already exists in database: ", existingProduct);
    //   return NextResponse.json({ error: "Product already exists in database" }, { status: 400 });
    // }

    console.log("Creating product in database...");
    let product;

    try {
      product = await Product.create({
        name,
        description,
        priceInEth: price,
        // attributes,
        // image: imageUrl,
        owner: recipient,
        category,
        quantity
      });
    } catch (e) {
      console.error("Error creating product in database: ", e);
      return NextResponse.json({ error: "Error creating product in database" }, { status: 500 });
    }

    if (!product) {
      return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }

    console.log("Product created in database: ", product);

    // Mint NFT
    if (!recipient.startsWith("0x")) {
      throw new Error("Recipient address is invalid or ENS is not supported on localnet");
    }
    
    const productInfo = `${name} - ${price}`;
    const parsedRecipient = getAddress(recipient);
    const tx = await contract.mintProductNFT(parsedRecipient, productInfo);
    console.log("Transaction sent : ", tx.hash);

    const receipt = await tx.wait();
    console.log("Full receipt: ", receipt);

    // Parse logs to find tokenId
    let tokenId: string | null = null;

    for (const log of receipt.logs) {
      try {
        const parsedLog: any = contract.interface.parseLog(log);
        if (parsedLog.name === "ProductMinted") {
          tokenId = parsedLog.args.tokenId.toString();
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!tokenId) {
      console.error("Token ID not found in logs");
      return NextResponse.json({ error: "Token ID not found in logs" }, { status: 500 });
    }

    console.log("NFT Minted with token ID: ", tokenId);

    return NextResponse.json({
      message: "NFT Minted successfully",
      transactionHash: tx.hash,
      tokenId
    }, { status: 200 });

  } catch (e) {
    console.error("Error minting NFT: ", e);
    return NextResponse.json({ error: "Error minting NFT" }, { status: 500 });
  }
}
