import { NextRequest, NextResponse } from "next/server";
import { contract } from "@/lib/contract";

export async function POST(req: NextRequest) {
    try {
        const { tokenId } = await req.json();

        const history: string[] = await contract.getOwnershipHistory(tokenId);
        
        const formattedHistory = history.map((address: string) => address.toString());

        return NextResponse.json({ history: formattedHistory });
    } catch (error) {
        console.error("Error fetching ownership history:", error);
        return NextResponse.json({ error: "Failed to fetch ownership history" }, { status: 500 });
    }
}
