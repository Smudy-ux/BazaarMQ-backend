import { publishToQueue } from "../utils/rabbitmq.js";

export const createOrder = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;
        const order = { userId, products: [{ productId, quantity }], createdAt: new Date() };
        await publishToQueue("order.created", order);
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};