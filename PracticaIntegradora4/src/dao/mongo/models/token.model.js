import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    expiresAt: { type: Date, default: Date.now, expires: 3600 }
})

export default mongoose.model("Token", tokenSchema)