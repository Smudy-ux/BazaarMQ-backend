import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    try {
        const headerToken = req.headers.authorization?.split(" ")[1];
        const cookieToken = req.cookies?.accessToken;
        const token = headerToken || cookieToken;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - no token" });
        }
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};
