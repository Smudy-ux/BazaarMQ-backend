import Product from "../models/Product.model.js"

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
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export { createProduct, getAllProducts }