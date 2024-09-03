import fs from "fs"
import multer from "multer"
import { __dirname } from "../utils/utils.js"

// Configuración Multer
const storage = multer.diskStorage({
	destination: function(req, file, cb){
		const documentType = req.body.documentType
		let folder = ""
		switch (documentType) {
			case "identification":
				folder = "identifications"
				break
			case "proof_of_address":
				folder = "proof_of_addresses"
				break
			case "account_statement":
				folder = "account_statements"
				break
			case "profile":
				folder = "profile"
				break
			case "product":
				folder = "products"
				break
			default:
				break
		}
		cb(null, __dirname + `/../public/uploads/${folder}`)
	},
	filename: function(req, file, cb){
		const name = file.originalname
		let time = new Date().getTime()
		cb(null, `${time}${name}`)
	}
})

export const uploader = multer({storage}).fields([
	{ name: "document", maxCount: 1 },
	{ name: "documentType", maxCount: 1 }
]);

export const deleteFile = (documentType, filename) => {
    let folder = ""
    switch (documentType) {
        case "identification":
            folder = "identifications"
            break
        case "proof_of_address":
            folder = "proof_of_addresses"
            break
        case "account_statement":
            folder = "account_statements"
            break
        case "profile":
            folder = "profile"
            break
        case "product":
            folder = "products"
            break
        default:
            break
    }
    try {
        fs.unlinkSync(`${__dirname}/../public/uploads/${folder}/${filename}`)
        return {status: "success", message: "File deleted"}
    }
    catch (err) {
        return {status: "error", message: "Error deleting file"}
    }
}