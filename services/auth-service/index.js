
import dotenv from "dotenv"
dotenv.config()

import mongoose from "mongoose"
import express from "express"
import cookieParser from "cookie-parser"
import authRoute from "./routes/auth.route.js"
import refreshRoute from "./routes/refresh.route.js"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRoute)
app.use("/api/refresh", refreshRoute)


mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err))

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`)
})