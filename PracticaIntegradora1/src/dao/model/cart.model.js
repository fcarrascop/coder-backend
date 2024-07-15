import mongoose from "mongoose"

const cartCollection = "cart"

const cartSchema = new mongoose.Schema({
    id: {type: String, required: true},
    products: {type: Array, default: []}
})

const cartModel = mongoose.model(cartCollection, cartSchema)

export default cartModel