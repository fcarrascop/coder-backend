import messageModel from "../dao/mongo/models/message.model.js"
import { tokenExtractor } from "../utils/utils.js"
import chatDTO from "../dao/DTOs/chat.dto.js"

export const chat = async (req, res) => {
    try {
        let user = new chatDTO(tokenExtractor(req.signedCookies["user"]))
        let list = await messageModel.find().sort({ $natural: -1}).limit(20).lean()
        list = list.reverse()
        res.render("chat", {"list": list, "user": user})
    }
    catch (err) {
        req.logger.error("Error al usar el chat")
    }
}