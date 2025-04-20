import { NextResponse } from 'next/server';
import { contract, wallet } from '@/lib/contract';
import connectDB from '@/lib/connectDB';
import Product from '@/models/Product.model';
import { getAddress } from 'ethers';

export async function POST(req: Request) {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const body = await req.json();
    const { tokenId, newOwner } = body;

    if (!tokenId || !newOwner || !newOwner.startsWith("0x")) {
      return NextResponse.json({ error: "Invalid tokenId or new owner address" }, { status: 400 });
    }
    console.log("NFT Owner:", await contract.ownerOf(tokenId));
console.log("Backend signer address (msg.sender):", wallet.address);
console.log("Is signer approved for all?", await contract.isApprovedForAll(newOwner, wallet.address));
console.log("Approved address for tokenId:", await contract.getApproved(tokenId));


    // Get current owner of the NFT
    const currentOwner = await contract.ownerOf(tokenId);
    const parsedNewOwner = getAddress(newOwner);

    console.log(`Transferring NFT #${tokenId} from ${currentOwner} to ${parsedNewOwner}`);

    // Perform transfer
    const tx = await contract["safeTransferFrom(address,address,uint256)"](currentOwner, parsedNewOwner, tokenId);
    console.log("Transaction hash: ", tx.hash);

    const receipt = await tx.wait();
    console.log("Transfer confirmed: ", receipt.transactionHash);

    // Update in MongoDB (optional but good UX)
    const updatedProduct = await Product.findOneAndUpdate(
      { tokenId },
      { owner: parsedNewOwner.toLowerCase() },
      { new: true }
    );

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
