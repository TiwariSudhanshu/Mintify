import { NextApiResponse } from "next";
import {contract} from "@/lib/contract";

export async function GET(res: NextApiResponse){
    try{
        const tokenIds = await contract.getAllContractTokens();
        const formattedTokenIds = tokenIds.map((tokenId: any) => tokenId.toString());
        res.json({ tokenIds: formattedTokenIds, length: formattedTokenIds.length });
    }
catch(e){
    console.error("Error getting NFT: ", e);
    res.status(500).json({
        error: "Error getting NFT",
    })
}
}