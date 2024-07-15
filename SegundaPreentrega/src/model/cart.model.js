import mongoose from "mongoose"

const cartSchema = new mongoose.Schema({
    id: {type: String, required: true},
    products: [
        {id: {type: mongoose.Schema.Types.ObjectId, ref: "products" }, quantity: Number}
    ]
})

cartSchema.pre("findOne", function() {
    this.populate("products.id")
})
cartSchema.pre("find", function() {
    this.populate("products.id")
})
cartSchema.pre("updateOne", function() {
    this.populate("products.id")
})

const cartModel = mongoose.model("carts", cartSchema)
export default cartModel