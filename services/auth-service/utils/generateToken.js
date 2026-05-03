import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { Token } from "../models/User.model.js"

const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.ACCESS_SECRET, { expiresIn: "1h" })
}

const generateRefreshToken = async (user) => {
    const token = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, { expiresIn: "7d" })
    await Token.create({
        userId: user._id,
        refresh_token: token
    })
    return token
}

const comparePassword = (password, hash) => {
    return bcrypt.compare(password, hash)
}


export { generateToken, generateRefreshToken, comparePassword }