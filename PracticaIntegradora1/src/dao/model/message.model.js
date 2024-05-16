import mongoose from "mongoose";

const messageCollection = "Message"

const messageSchema = new mongoose.schema({
    user: {type: String, required: true, max: 50},
    message: {type: String, required: true, max: 180}
})

const messageModel = mongoose.model(messageCollection, messageSchema)

export default messageModel;



