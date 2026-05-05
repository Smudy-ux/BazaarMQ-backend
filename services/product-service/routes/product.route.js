import express from "express"
import { protect } from "../middleware/middleware.js"
import { createProduct, getAllProducts } from "../controllers/product.controller.js"
const router = express.Router()


router.post("/create", protect, createProduct)
router.get("/", getAllProducts)

export default router
