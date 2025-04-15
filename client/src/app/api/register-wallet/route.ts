import connectDB from "@/lib/connectDB";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User.models";
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    // Parse the request body
    const body = await req.json();
    const { walletAddress, name, email, userRole } = body;
    if (!walletAddress || !name || !email || !userRole) {
      return NextResponse.json(
        { message: "Please fill all the fields" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ walletAddress: walletAddress });
    if (existingUser) {
      return NextResponse.json(
        { message: "Wallet already registered" },
        { status: 400 }
      );
    }
    
    const newUser = await User.create({
      name,
      email,
      walletAddress,
      userRole
    });
    
    return NextResponse.json(
      { message: "Wallet registered successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in registerWallet API: ", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}