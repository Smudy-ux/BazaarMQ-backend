
import dotenv from "dotenv"
dotenv.config()

import mongoose from "mongoose"
import express from "express"

const app = express()


mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err))

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`)
})