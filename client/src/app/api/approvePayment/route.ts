import { escrowContract } from "@/lib/contract";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try{
        const {productId} = await req.json();
        const tx = await escrowContract.approvePayment(productId)
        await tx.wait();
        return NextResponse.json({message: "Approved Payment"},{status:200});
    }
    catch{
        return NextResponse.json({message: "Failed to approve payment"}, {status:500})
    }
}