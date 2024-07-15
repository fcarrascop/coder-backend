import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    edit: { type: Boolean, default: false }
});

const User = mongoose.model("User", userSchema);

export default User;