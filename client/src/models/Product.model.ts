import mongoose, { Schema, Document } from 'mongoose';

interface Attribute {
    type: string;
    value: string;
}
 interface Product {
    name: string;
    description: string;
    priceInEth: number;
    attributes: Attribute[];
    image: string;
    owner: string;
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
    attributes: { type: [AttributeSchema], required: true },
    image: { type: String, required: true },
    owner: { type: String, required: true },
});

const ProductModel = mongoose.model<ProductDocument>('Product', ProductSchema);

export default ProductModel;