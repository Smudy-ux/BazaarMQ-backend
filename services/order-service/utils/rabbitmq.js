import amqp from "amqplib";
import Order from "../models/Order.model.js";
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

export const publishToQueue = async (queueName, data) => {
    if (!channel) {
        console.error("No channel");
        return;
    }
    await channel.assertQueue(queueName);
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    console.log(`Published to queue ${queueName}`);
};

export const consumeOrderCreated = async () => {
    if (!channel) {
        console.error("No channel");
        return;
    }
    await channel.assertQueue("order.created");
    channel.consume("order.created", async (msg) => {
        if (msg) {
            const order = JSON.parse(msg.content.toString());
            await saveOrderToDatabase(order);
            channel.ack(msg);
        }
    });
};

export const saveOrderToDatabase = async (order) => {
    try {
        await Order.create(order);
        console.log("Order saved to database");
    } catch (error) {
        console.error("Failed to save order to database", error);
    }
};