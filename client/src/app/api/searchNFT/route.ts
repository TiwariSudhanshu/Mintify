import { NextResponse } from "next/server";
import Product from "@/models/Product.model";
import connectDB from "@/lib/connectDB";

export async function POST(req: Request) {
    try {
        await connectDB();
        console.log("Connected to DB");
        
        const { tokenId } = await req.json();
        console.log("Searching for product with tokenId:", tokenId);

        if (!tokenId) {
            return NextResponse.json(
                { error: "Token ID is required" },
                { status: 400 }
            );
        }

        const product = await Product.findOne({ tokenId });
        console.log("Found product:", product);

        if (!product) {
            console.log("No product found with tokenId:", tokenId);
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            ProductInfo: {
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
                tokenId: product.tokenId
            }
        });

    } catch (error) {
        console.error("Error searching for NFT:", error);
        return NextResponse.json(
            { error: "Failed to search for NFT" },
            { status: 500 }
        );
    }
}