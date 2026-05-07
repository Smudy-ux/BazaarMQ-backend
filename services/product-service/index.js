import dotenv from "dotenv"
dotenv.config()

import mongoose from "mongoose"
import express from "express"
import cookieParser from "cookie-parser"
import productsRoute from "./routes/product.route.js"
import { connectToRabbitMQ, consumeOrderCreated } from "./utils/rabbitmq.js"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use("/api/products", productsRoute)

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err))

await connectToRabbitMQ()
await consumeOrderCreated()

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`)
})
