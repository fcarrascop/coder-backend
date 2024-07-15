import { Server } from "socket.io";
import messageModel from "../dao/mongo/models/message.model.js";

export function configWebSocket(httpServer) {
    const socketServer = new Server(httpServer)

    // Comunicación de WebSocket
    socketServer.on("connection", (socket)=>{
        socket.on("message", async (data)=>{
            let message = await messageModel.create({"user": data.user, "message": data.message})
            let log = await messageModel.find().sort({ $natural: -1 }).limit(20)
            log = log.reverse()
            socketServer.emit("messageUpdate", log)
        })
    })
}