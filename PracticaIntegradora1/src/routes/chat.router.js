import { Router } from "express"
import messageModel from "../dao/model/message.model.js"

const router = Router()

router.get("/chat", async (req, res) => {
    try {
        let list = await messageModel.find().sort({ $natural: -1 }).limit(20).lean()
        list = list.reverse()
        res.render("chat", { list })
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Server Error")
    }
})

export default router
