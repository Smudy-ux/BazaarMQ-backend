import { publishToQueue } from "../utils/rabbitmq.js";

const API_GATEWAY_URL = "http://localhost:3000";

export const createOrder = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        const response = await fetch(`${API_GATEWAY_URL}/api/products/${productId}/stock`);
        if (!response.ok) {
            return res.status(404).json({ message: "Product not found" });
        }

        const { stock } = await response.json();

        if (stock < quantity) {
            return res.status(400).json({
                message: "Insufficient stock",
                available: stock,
                requested: quantity
            });
        }

        const order = { userId, products: [{ productId, quantity }], createdAt: new Date() };
        await publishToQueue("order.created", order);
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
