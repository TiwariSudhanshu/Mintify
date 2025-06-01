import mongoose, { Schema, Document } from 'mongoose';

interface Attribute {
    type: string;
    value: string;
}
interface Payment {
    priceInEth: number;
    tokenId: string;
    from: string;
}
 interface Product {
    name: string;
    description?: string;
    priceInEth: number;
    tokenId?: string;
    attributes?: Attribute[];
    image?: string;
    category: string;
    quantity: number;
    owner: string;
    Payment: Payment;
    ownershipHistory: {
        address: string;
        timestamp: Date;
        txHash: string;
    }[];
}


interface ProductDocument extends Document, Product {}

const AttributeSchema = new Schema<Attribute>({
    type: { type: String, required: true },
    value: { type: String, required: true },
});

const ProductSchema = new Schema<ProductDocument>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    priceInEth: { type: Number, required: true },
    tokenId: { type: String, required: true, unique: true },
    attributes: { type: [AttributeSchema] },
    image: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    owner: { type: String, required: true },
    ownershipHistory: [{
        address: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        txHash: { type: String, required: true },
    }],
    Payment: { 
        type: { 
            priceInEth: { type: Number },
            tokenId: { type: String },
            from: { type: String },
        },
        default: {}
    },
}, {
    timestamps: true,
});

const Product = mongoose.models.Product || mongoose.model<ProductDocument>('Product', ProductSchema);

export default Product;