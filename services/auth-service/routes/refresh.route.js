import express from "express"
import { refreshToken } from "../controllers/auth.controller.js"
import { verifyRefreshToken } from "../middleware/middleware.js"

const router = express.Router()

router.post("/refresh", verifyRefreshToken, refreshToken)

export default router