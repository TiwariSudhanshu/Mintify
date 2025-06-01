export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Product from '@/models/Product.model';
import { ethers } from 'ethers';
import { getProviderAndSigner, contract_ABI, contractAddress } from '@/lib/contract';

export async function POST(req: Request) {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const body = await req.json();
    const { tokenId, newOwner } = body;

    if (!tokenId || !newOwner || !newOwner.startsWith("0x")) {
      return NextResponse.json({ error: "Invalid tokenId or new owner address" }, { status: 400 });
    }

    // Get provider and signer
    const { signer } = await getProviderAndSigner();
    const contract = new ethers.Contract(contractAddress, contract_ABI, signer);

    // Get current owner of the NFT
    const currentOwner = await contract.ownerOf(tokenId);
    const parsedNewOwner = ethers.getAddress(newOwner);

    console.log(`Transferring NFT #${tokenId} from ${currentOwner} to ${parsedNewOwner}`);

    // Perform transfer
    const tx = await contract.safeTransferFrom(currentOwner, parsedNewOwner, tokenId);
    console.log("Transaction hash: ", tx.hash);

    const receipt = await tx.wait();
    console.log("Transfer confirmed: ", receipt.transactionHash);

    // Update in MongoDB
    const updatedProduct = await Product.findOneAndUpdate(
      { tokenId },
      { 
        $set: { owner: parsedNewOwner.toLowerCase() },
        $push: { 
          ownershipHistory: {
            address: parsedNewOwner.toLowerCase(),
            timestamp: new Date().toISOString(),
            txHash: receipt.transactionHash
          }
        }
      },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found in database" }, { status: 404 });
    }

    return NextResponse.json({
      message: "NFT transferred successfully",
      transactionHash: tx.hash,
      updatedOwner: parsedNewOwner,
      updatedProduct
    }, { status: 200 });

  } catch (e: any) {
    console.error("Error transferring NFT: ", e);
    return NextResponse.json({ error: e.message || "Transfer failed" }, { status: 500 });
  }
}
