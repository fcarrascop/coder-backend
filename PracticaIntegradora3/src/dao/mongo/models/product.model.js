import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productCollection = "products"

const productSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    title: {type: String, required: true, max: 80},
    description: {type: String, required: true, max: 120},
    price: {type: Number, required: true},
    thumbnail: {type: String, required: true, max: 120},
    code: {type: String, required: true, max: 40},
    stock: {type: Number, required: true},
    status: {type: Boolean, required: true},
    category: {type: String, required: true, max: 120},
    owner: {type: String, default: "admin"}
})

productSchema.plugin(mongoosePaginate)
const productModel = mongoose.model(productCollection, productSchema)
export default productModel;