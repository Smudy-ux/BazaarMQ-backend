import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true, select: false },
})

const tokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    refresh_token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
    expiresAt: { type: Date, default: () => Date.now() + 7 * 24 * 60 * 60 * 1000 }
})

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(this.password, salt)
    this.password = hash
})

const User = mongoose.model("User", userSchema);
const Token = mongoose.model("Token", tokenSchema);

export { User, Token }