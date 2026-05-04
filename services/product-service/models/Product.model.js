import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }
})

const Product = mongoose.model("Product", productSchema);

export default Product
