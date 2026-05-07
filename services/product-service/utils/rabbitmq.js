import amqp from "amqplib";
import Product from "../models/Product.model.js";
import dotenv from "dotenv";
dotenv.config();

const amqpUrl = process.env.AMQP_URL;

let channel = null;

export const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(amqpUrl);
        channel = await connection.createChannel();
        console.log("Connected to RabbitMQ");
    } catch (error) {
        console.error("Failed to connect to RabbitMQ", error);
        process.exit(1);
    }
};

export const consumeOrderCreated = async () => {
    if (!channel) {
        console.error("No channel");
        return;
    }
    await channel.assertQueue("order.created");
    channel.consume("order.created", async (msg) => {
        if (msg) {
            try {
                const order = JSON.parse(msg.content.toString());
                await deductStockFromOrder(order);
                channel.ack(msg);
            } catch (error) {
                console.error("Failed to process order:", error);
                channel.nack(msg, false, true);
            }
        }
    });
    console.log("Consuming from order.created queue");
};

const deductStockFromOrder = async (order) => {
    try {
        for (const item of order.products) {
            const product = await Product.findById(item.productId);
            if (!product) {
                console.error(`Product ${item.productId} not found`);
                continue;
            }
            if (product.stock < item.quantity) {
                console.error(`Insufficient stock for product ${item.productId}`);
                continue;
            }
            product.stock -= item.quantity;
            await product.save();
            console.log(`Deducted ${item.quantity} from product ${item.productId}, new stock: ${product.stock}`);
        }
    } catch (error) {
        console.error("Failed to deduct stock:", error);
        throw error;
    }
};
