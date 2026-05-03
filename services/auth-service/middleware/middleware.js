import jwt from "jsonwebtoken"

const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" })
    }
}

const verifyRefreshToken = (req, res, next) => {
    const token = req.cookies.refreshToken

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    try {
        const decoded = jwt.verify(token, process.env.REFRESH_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" })
    }
}


export { verifyToken, verifyRefreshToken }