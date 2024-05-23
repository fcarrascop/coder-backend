import mongoose from "mongoose"

const cartCollection = "cart"

const cartSchema = new mongoose.Schema({
    id: {type: String, required: true},
    products: {type: Array, default: []}
})

cartSchema.pre("find", function(){
    this.populate("products.id")
})

cartSchema.pre("findOne", function(){
    this.populate("products.id")
})

cartSchema.pre("updateOne", function(){
    this.populate("products.id")
})


const cartModel = mongoose.model(cartCollection, cartSchema)

export default cartModel

