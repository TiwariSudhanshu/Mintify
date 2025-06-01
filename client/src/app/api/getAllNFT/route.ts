export const runtime = 'nodejs';

import { NextResponse, NextRequest } from "next/server";
import Product from "@/models/Product.model";
import connectDB from "@/lib/connectDB";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    // Get all products from the database
    const products = await Product.find({});
    
    if (!products || products.length === 0) {
      return NextResponse.json({ message: "No NFTs found" }, { status: 404 });
    }

    // Process the products to match the expected format
    const processedProducts = products.map(product => ({
      _id: product._id,
      name: product.name,
      description: product.description,
      image: product.image,
      priceInEth: product.priceInEth,
      category: product.category,
      owner: product.owner,
      attributes: product.attributes || [],
      status: "Available",
      createdAt: product.createdAt,
      tokenId: product.tokenId
    }));

    return NextResponse.json({ products: processedProducts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return NextResponse.json(
      { message: "Failed to fetch NFTs" },
      { status: 500 }
    );
  }
}
