import mongoose, { Schema, Document } from 'mongoose';

interface Attribute {
    type: string;
    value: string;
}
 interface Product {
    name: string;
    description?: string;
    priceInEth: number;
    attributes?: Attribute[];
    image?: string;
    category: string;
    quantity: number;
    owner: string;
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
    attributes: { type: [AttributeSchema]},
    image: { type: String },
    category: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    owner: { type: String, required: true },
});

const Product = mongoose.models.Product || mongoose.model<ProductDocument>('Product', ProductSchema);

export default Product;