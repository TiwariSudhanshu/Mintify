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
}


interface ProductDocument extends Document, Product {}

const AttributeSchema = new Schema<Attribute>({
    type: { type: String, required: true },
    value: { type: String, required: true },
});

const ProductSchema = new Schema<ProductDocument>({
    name: { type: String, required: true },
    description: { type: String},
    priceInEth: { type: Number, required: true },
    tokenId: { type: String },
    attributes: { type: [AttributeSchema]},
    image: { type: String },
    category: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    owner: { type: String, required: true },
    Payment: { 
        type: { 
            priceInEth: { type: Number },
            tokenId: { type: String },
            from: { type: String },
        },
        default: {}
    },});

const Product = mongoose.models.Product || mongoose.model<ProductDocument>('Product', ProductSchema);

export default Product;