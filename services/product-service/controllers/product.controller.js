import Product from "../models/Product.model.js"

const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, stock, category } = req.body
        const product = new Product({ name, description, price, image, stock, category, ownerId: req.user.id })
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

const getProductStock = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).select("stock");
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ stock: product.stock });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { createProduct, getAllProducts, getProductStock }