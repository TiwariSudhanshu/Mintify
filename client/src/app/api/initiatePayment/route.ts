import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product.model";

export async function POST(request: NextRequest){
    try{
        const {amountInEth, address, productId} = await request.json();
        if(!amountInEth || !address || !productId){
            return NextResponse.json({message: "Please provide all the fields"}, {status: 400})
        }

        // Save payment information to database
        const savePayment = await Product.findOneAndUpdate(
            { tokenId: productId },
            {
                $set: {
                    Payment: {
                        priceInEth: parseFloat(amountInEth),
                        tokenId: productId,
                        from: address,
                    }
                }
            },
            { new: true }
        );
        if(!savePayment){
            return NextResponse.json({message: "Product not found"}, {status: 404})
        }

        console.log("Payment Saved", savePayment);

        return NextResponse.json({message: "Payment information saved"}, {status:200})
        
    }
    catch(err:any){
        return NextResponse.json({message: err.message}, {status: 500})
    }
}