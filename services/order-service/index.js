import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import orderRoutes from "./routes/order.route.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/order", orderRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Order service is running on port ${PORT}`);
});