import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product.model";

export async function POST(req: NextRequest){
    try{
        const {productId} = await req.json();
        
        // Update payment status in database
        const updatedProduct = await Product.findOneAndUpdate(
            { tokenId: productId },
            { $set: { "Payment.status": "rejected" } },
            { new: true }
        );

        if (!updatedProduct) {
            return NextResponse.json({message: "Product not found"}, {status: 404});
        }

        return NextResponse.json({message: "Payment rejected in database"}, {status:200});
    }
    catch(error){
        console.error("Error rejecting payment:", error);
        return NextResponse.json({message: "Failed to reject payment"}, {status:500});
    }
}