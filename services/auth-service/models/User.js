import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true, select: false },
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    try {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(this.password, salt)
        this.password = hash
        next()
    } catch (error) {
        next(error)
    }
})

const User = mongoose.model("User", userSchema);
export default User;