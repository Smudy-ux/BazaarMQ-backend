import express from "express"
import { protect } from "../middleware/middleware.js"
import { createProduct, getAllProducts, getProductStock } from "../controllers/product.controller.js"
const router = express.Router()


router.post("/create", protect, createProduct)
router.get("/", getAllProducts)
router.get("/:id/stock", getProductStock)

export default router
