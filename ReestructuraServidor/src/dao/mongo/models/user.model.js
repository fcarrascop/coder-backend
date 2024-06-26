import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    role: { type: String, default: "user" },
    cartId: { type: mongoose.Schema.Types.ObjectId }
});

userSchema.pre("findOne", function() {
    this.populate("cartId")
})

const User = mongoose.model("User", userSchema);

export default User;