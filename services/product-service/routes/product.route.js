import express from "express"
import Product from "../models/Product.model.js"
import { protect } from "../middleware/middleware.js"
const router = express.Router()

const createProduct = async (req, res) => {
    try {
        const { name, description, price, image } = req.body
        const product = new Product({ name, description, price, image, userId: req.user.id })
        await product.save()
        res.status(201).json({ product })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

router.post("/", protect, createProduct)

export default router
