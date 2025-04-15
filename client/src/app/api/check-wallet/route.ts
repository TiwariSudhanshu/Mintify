import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import User from "@/models/User.models";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address } = body;
    
    if (!address) {
      return NextResponse.json(
        { message: "Please provide a wallet address" },
        { status: 400 }
      );
    }

    console.log("Address: ", address);

    await connectDB();

    const existingUser = await User.findOne({ walletAddress: address });

    if (existingUser) {
      return NextResponse.json({ exists: true, existingUser }, { status: 200 });
    } else {
      return NextResponse.json({ exists: false }, { status: 200 });
    }
  } catch (error) {
    console.log("Error in checkWallet API: ", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}