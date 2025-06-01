import { NextResponse } from 'next/server';
import Product from '@/models/Product.model';
import cloudinary from '@/lib/cloudinary';
import connectDB from '@/lib/connectDB';

// This is needed for App Router API routes
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const priceInEth = formData.get('priceInEth') as string;
    const category = formData.get('category') as string;
    const image = formData.get('image') as File;
    const owner = formData.get('owner') as string;
    const tokenId = formData.get('tokenId') as string;

    if (!name || !description || !priceInEth || !category || !image || !owner || !tokenId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'nft-images',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // Create new product in database
    const product = new Product({
      name,
      description,
      priceInEth: parseFloat(priceInEth),
      category,
      image: (uploadResponse as any).secure_url,
      owner: owner.toLowerCase(),
      tokenId,
      attributes: []
    });

    await product.save();

    return NextResponse.json(
      { 
        message: 'NFT created successfully',
        product: {
          _id: product._id,
          name: product.name,
          description: product.description,
          image: product.image,
          priceInEth: product.priceInEth,
          category: product.category,
          owner: product.owner,
          tokenId: product.tokenId,
          attributes: product.attributes
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating NFT:', error);
    return NextResponse.json(
      { message: 'Failed to create NFT' },
      { status: 500 }
    );
  }
}
