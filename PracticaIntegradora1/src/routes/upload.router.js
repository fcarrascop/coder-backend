import { Router } from "express";
import { uploader } from "../utils.js";

const router = Router()

router.post("/upload", uploader.single("file"), (req,res)=>{
    let response = (!req.file) ? {"error": "No se pudo guardar el archivo"} : {"API": "Archivo guardado correctamente"}
    res.json(response)
})

export default router