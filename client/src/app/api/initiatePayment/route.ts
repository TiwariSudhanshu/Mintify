import { NextRequest, NextResponse } from "next/server";
import { escrowContract } from "@/lib/contract";
import { ethers } from "ethers";
import Product from "@/models/Product.model";

export async function POST(request: NextRequest){
    try{
        const {amountInEth, address, productId} = await request.json();
        if(!amountInEth || !address || !productId){
            return NextResponse.json({message: "Please provide all the fields"}, {status: 400})
        }
        //Cheek if payment already exist
        // const paymentExist = await Product.findOne({tokenId: productId, "Payment.from": address});
        // if(paymentExist){
            // return NextResponse.json({message: "Payment already exist"}, {status: 400})
        // }
        // const tx = await escrowContract.initiatePayment(productId, address,{
        //     value: ethers.parseEther(amountInEth)
        // });
        // await tx.wait();
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

        // console.log("Payment Done", tx);
        console.log("Payment Saved", savePayment);

        return NextResponse.json({message: "Payment Done"}, {status:200})
        
    }
    catch(err:any){
        return NextResponse.json({message: err.message}, {status: 500})
    }
}