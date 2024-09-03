import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    user: {type: String, required: true},
    message: {type: String, required: true}
})

const messageModel = mongoose.model("messages", messageSchema)

export default messageModel