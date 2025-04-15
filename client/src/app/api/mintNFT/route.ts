import { NextApiRequest, NextApiResponse } from 'next';
import { contract } from '@/lib/contract';

export async function POST(req: NextApiRequest, res:NextApiResponse){
   try{
    const {recipient, name, price} = req.body;
    console.log(`Minting NFT for ${recipient} with name ${name} and price ${price}`);

    if(!recipient || !name || !price) {
        return new Response('Missing required fields', {status: 400});
    }
    const productInfo = `${name} - ${price}`;
    const tx = await contract.mintProductNFT(recipient, productInfo);
    console.log("Transaction sent : ", tx.hash);
    const receipt = await tx.wait();
    console.log("Full reciept : ", receipt);

    let tokenId = null;
    for(const log of receipt.logs){
        try{
            const parsedLog: any = contract.interface.parseLog(log);
            if(parsedLog.name == "ProductMinted"){
                tokenId = parsedLog.args.tokenId.toString();
                break;
            }
        } catch(e){
            console.error("Error parsing log: ", e);
            continue;
        }
    }

    if(!tokenId){
        console.error("Token ID not found in logs");    
        return res.status(500).json({error: "Token ID not found in logs"});       
    }

    console.log("NFT Minted with token ID: ", tokenId);

    res.status(200).json({
        message: "NFT Minted successfully",
        transactionHash: tx.hash,
        tokenId
    })
   } catch(e){
    console.error("Error minting NFT: ", e);
    res.status(500).json({
        error: "Error minting NFT",
    })
   }
}
