import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, default: 1, min: 1 },
    ownerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product
