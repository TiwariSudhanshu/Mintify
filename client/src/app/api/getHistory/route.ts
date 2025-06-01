export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Product from "@/models/Product.model";
import { ethers } from 'ethers';
import { getProviderAndSigner, contract_ABI, contractAddress } from '@/lib/contract';

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

        // Get provider and signer
        const { signer } = await getProviderAndSigner();
        const contract = new ethers.Contract(contractAddress, contract_ABI, signer);

        // Get ownership history from contract
        const history = await contract.getOwnershipHistory(tokenId);
        console.log("Contract ownership history:", history);

        // Convert addresses to lowercase for consistency
        const formattedHistory = history.map((address: string) => address.toLowerCase());

        return NextResponse.json({
            history: formattedHistory
        }, { status: 200 });

    } catch (e: any) {
        console.error("Error fetching ownership history:", e);
        return NextResponse.json({ error: e.message || "Failed to fetch ownership history" }, { status: 500 });
    }
}
