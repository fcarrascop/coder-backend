import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/adminAuth.js";
import { premiumRole, upload, clearDocuments, getUsers, deleteIdle, modifyRole, deleteUser } from "../controllers/users.controller.js";
import { uploader } from "../services/files.service.js";
const router = Router();

router.post("/api/users/premium/:uid", isAuthenticated,  premiumRole)
router.post("/api/users/:uid/documents", isAuthenticated, uploader, upload)
router.post("/api/users/:uid/documents/clear", isAuthenticated, clearDocuments)
router.get("/api/users", isAuthenticated, getUsers)
router.delete("/api/users", isAuthenticated, deleteIdle)
router.put("/api/users/role", isAuthenticated, isAdmin, modifyRole)
router.delete("/api/users/one", isAuthenticated, isAdmin, deleteUser)

export default router