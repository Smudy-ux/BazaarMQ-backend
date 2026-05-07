import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    products: [
        {
            productId: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    status: {
        type: String,
        enum: ["pending", "completed", "cancelled"],
        default: "pending",
    },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);