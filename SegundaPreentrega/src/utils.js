import { fileURLToPath } from "url"
import { dirname } from "path"
import multer from "multer"

// Configuración para handlebars
const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

// Configuración de multer
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, __dirname + "/public/archivos")
    },
    filename: function(req, file, cb){
        cb(null,file.originalname)
    }
})

export const uploader = multer({storage})
