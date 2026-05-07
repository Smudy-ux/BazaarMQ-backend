import express from "express";
import cookieParser from "cookie-parser";
import orderRoutes from "./routes/order.route.js";
import { connectToRabbitMQ, consumeOrderCreated } from "./utils/rabbitmq.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

await connectToRabbitMQ();
await consumeOrderCreated();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/order", orderRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Order service is running on port ${PORT}`);
});