export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import Product from "@/models/Product.model";
import connectDB from "@/lib/connectDB";
import { Document } from "mongoose";

interface IProduct extends Document {
  _id: string;
  name: string;
  description: string;
  image: string;
  priceInEth: number;
  category: string;
  owner: string;
  attributes: any[];
  status: string;
  createdAt: Date;
  tokenId: number;
}

export async function GET() {
  try {
    await connectDB();
    console.log("Fetching all products from database...");
    
    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    if (!products || products.length === 0) {
      console.log("No products found");
      return NextResponse.json(
        { products: [] },
        { status: 200 }
      );
    }

    // Process the products to match the expected format
    const processedProducts = products.map((product: IProduct) => ({
      _id: product._id,
      name: product.name,
      description: product.description,
      image: product.image,
      priceInEth: product.priceInEth,
      category: product.category,
      owner: product.owner,
      attributes: product.attributes,
      status: product.status,
      createdAt: product.createdAt,
      tokenId: product.tokenId,
    }));

    console.log("Returning processed products:", processedProducts);
    return NextResponse.json({ products: processedProducts });
  } catch (error) {
    console.error("Error in getAllNFT route:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
