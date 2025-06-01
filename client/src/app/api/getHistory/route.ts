export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Product from "@/models/Product.model";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        console.log("Connected to DB");

        const { tokenId } = await req.json();
        console.log("Getting history for tokenId:", tokenId);

        if (!tokenId) {
            return NextResponse.json(
                { error: "Token ID is required" },
                { status: 400 }
            );
        }

        // Find the product and get its ownership history
        const product = await Product.findOne({ tokenId });
        console.log("Found product:", product);

        if (!product) {
            console.log("No product found with tokenId:", tokenId);
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        // For now, we'll return a simple history with just the current owner
        // In a real implementation, you would store and retrieve the full ownership history
        const history = [product.owner];

        console.log("Returning ownership history:", history);
        return NextResponse.json({ history });

    } catch (error) {
        console.error("Error fetching ownership history:", error);
        return NextResponse.json(
            { error: "Failed to fetch ownership history" },
            { status: 500 }
        );
    }
}
