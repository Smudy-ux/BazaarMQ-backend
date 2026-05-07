import express from "express";
import { createOrder } from "../controllers/order.controller.js";
import { protect } from '../middleware/middleware.js';

const router = express.Router();

router.post("/create-order", protect, createOrder);

export default router;