import mongoose from "mongoose"

const ticketSchema = new mongoose.Schema({
    code: String,
    purchaseTime: String,
    amount: Number,
    purchaser: String
})

const ticketModel = mongoose.model("tickets", ticketSchema)
export default ticketModel