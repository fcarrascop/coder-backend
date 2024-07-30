import { Router } from "express";
import { chat } from "../controllers/chat.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = Router()

router.get("/chat", isAuthenticated, chat)

export default router