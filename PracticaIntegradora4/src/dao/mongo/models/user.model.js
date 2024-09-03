import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    profile: { type: String, default: "null" },
    role: { type: String, default: "user" },
    cartId: { type: mongoose.Schema.Types.ObjectId },
    lastConnection: { type: Date, default: Date.now },
    documents: [{
        name: String,
        status: { type: String, default: "pending" },
        reference: String
    }]
});

userSchema.pre("findOne", function() {
    this.populate("cartId")
})

const User = mongoose.model("User", userSchema);

export default User;