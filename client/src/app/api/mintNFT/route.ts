import { NextResponse } from 'next/server';
import { contract } from '@/lib/contract';
import Product from '@/models/Product.model';
import cloudinary from '@/lib/cloudinary';
import connectDB from '@/lib/connectDB';
import { getAddress } from 'ethers';
import formidable from 'formidable';
import { promises as fs } from 'fs';
import { IncomingMessage } from 'http';
import { NextApiRequest } from 'next';

// This is needed for App Router API routes
export const config = {
  api: {
    bodyParser: false,
  },
};

// Create a helper function that properly handles multipart form data
const parseForm = async (req: Request) => {
  const formData = await req.formData();
  const fields: Record<string, string> = {};
  const files: Record<string, any> = {};
  
  // Process each entry in the FormData
  for (const [key, value] of formData.entries()) {
    // If the value is a File, store it in files
    if (value instanceof File) {
      // Write the file to a temporary location
      const buffer = Buffer.from(await value.arrayBuffer());
      const tempFilePath = `/tmp/${Date.now()}-${value.name}`;
      await fs.writeFile(tempFilePath, buffer);
      
      files[key] = {
        filepath: tempFilePath,
        originalFilename: value.name,
        mimetype: value.type,
        size: value.size
      };
    } else {
      // Otherwise, store it in fields
      fields[key] = value.toString();
    }
  }
  
  return { fields, files };
};

export async function POST(req: Request) {
  try {
    await connectDB();
    console.log("Connected to MongoDB");
    
    // Parse the form data including the image file
    const { fields, files } = await parseForm(req);
    
    // Extract fields (already strings, not arrays)
    const { recipient, name, description, price, quantity, category } = fields;
    
    if (!recipient || !name || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Handle image upload to Cloudinary
    let imageUrl = null;
    try {
      if (files.image) {
        const imageFile = files.image;
        const imageData = await fs.readFile(imageFile.filepath);
        
        // Upload to Cloudinary
        const uploadRes = await cloudinary.uploader.upload(
          `data:${imageFile.mimetype};base64,${imageData.toString('base64')}`, 
          { folder: 'products' }
        );
        imageUrl = uploadRes.secure_url;
        console.log("Image uploaded to Cloudinary:", imageUrl);
        
        // Clean up the temp file
        await fs.unlink(imageFile.filepath);
      }
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
    }

    // Check if product already exists
    const existingProduct = await Product.findOne({ name, owner: recipient });
    if (existingProduct) {
      console.error("Product already exists in database: ", existingProduct);
      return NextResponse.json({ error: "Product already exists in database" }, { status: 400 });
    }

    console.log("Creating product in database...");
    let product;

    try {
      product = await Product.create({
        name,
        description,
        priceInEth: price,
        image: imageUrl,
        owner: recipient.toLowerCase(),
        category,
        quantity: parseInt(quantity) || 1
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
      tokenId,
      product
    }, { status: 200 });

  } catch (e) {
    console.error("Error minting NFT: ", e);
    return NextResponse.json({ error: "Error minting NFT" }, { status: 500 });
  }
}