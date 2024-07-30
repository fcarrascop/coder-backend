import { Router } from "express";
import { mocking } from "../controllers/mocking.controller.js";

const router = Router()

router.get("/mocking", mocking)

export default router