import { generateToken, generateRefreshToken, comparePassword } from "../utils/generateToken.js"
import { User, Token } from "../models/User.model.js"

const login = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select("+password")

    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }
    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const token = generateToken(user)
    const refreshToken = await generateRefreshToken(user)

    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.json({ message: "Login" })
}

const register = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return res.status(409).json({ message: "User already exists" })
    }

    const user = await User.create({ email, password })

    const token = generateToken(user)
    const refreshToken = await generateRefreshToken(user)

    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(201).json({ message: "User created", user: { id: user._id, email: user.email } })
}

const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if (refreshToken) {
        await Token.deleteOne({ refresh_token: refreshToken })
    }
    res.clearCookie("accessToken", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" })
    res.clearCookie("refreshToken", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" })
    return res.json({ message: "Logged out" })
}

const refreshToken = async (req, res) => {
    const user = await User.findById(req.user.id)
    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    await Token.deleteOne({ refresh_token: req.cookies.refreshToken })

    const token = generateToken(user)
    const newRefreshToken = await generateRefreshToken(user)

    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 1000
    })

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.json({ message: "Token refreshed" })
}


export { login, register, logout, refreshToken }