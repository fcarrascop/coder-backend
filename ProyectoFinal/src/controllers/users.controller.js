import User from "../dao/mongo/models/user.model.js"
import { deleteFile } from "../services/files.service.js"
import { refreshCookie } from "../utils/utils.js"
import { UserDisplayDTO } from "../dao/DTOs/users.dto.js"

export const premiumRole = async (req, res) => {
    let userId = (req.params.uid).toString()
    let user = await User.findOne({_id: userId})
    if (!user) return res.json({status: "error", error: "Usuario no encontrado"})
    if (user.role === "user") {
        let documents = user.documents
        let counter = 0
        documents.forEach(doc => {
            if ((doc.name === "identification" && doc.status === "uploaded") || (doc.name === "account_statement" && doc.status === "uploaded") || (doc.name === "proof_of_address" && doc.status === "uploaded")) counter++
        })
        if (counter < 3) {
            return res.json({status: "error", error: "Faltan documentos por subir"})
        }
    }
    let role = "user"
    if (user.role === "user") {role = "premium"}
    user.role = role
    await User.updateOne({email: user.email}, user)
    refreshCookie(res, user)
    res.json({status: "success", message: `Rol cambiado a ${role}`})
}

export const upload = async (req, res) => {
    if (!req.files.document) {
        return res.status(400).send({status: "error", message: "No file uploaded"})
    }
    let uid = req.params.uid
    let user = await User.findOne({ _id: uid })
    // Validations
    if (!user) {
        deleteFile(req.body.documentType, req.files.document[0].filename)
        return res.status(404).send({status: "error", message: "User not found"})
    }
    
    let documents = user.documents
    documents.some(doc => doc.name === req.body.documentType)
    if (documents) {
        let index = documents.findIndex(doc => doc.name === req.body.documentType)
        if (index !== -1  ) {
            deleteFile(req.body.documentType, req.files.document[index].name)
            return res.status(400).send({status: "error", message: "Document already uploaded"})
        }
    }

    let document = {
        name: req.body.documentType,
        status: "uploaded",
        reference: req.files.document[0].filename
    }
    user.documents.push(document)
    await user.save()

    res.send({status: "success", message: "File uploaded", payload: req.files.document})
}

export const clearDocuments = async (req, res) => {
    let uid = req.params.uid
    let user = await User.findOne({ _id: uid })
    if (!user) {
        return res.status(404).send({status: "error", message: "User not found"})
    }
    let documents = user.documents
    documents.forEach(doc => {
        deleteFile(doc.name, doc.reference)
    })
    user.documents = []
    await user.save()
    res.send({status: "success", message: "Documents cleared"})
}

// Send
export const getUsers = async (req, res) => {
    let users = await User.find()
    let list = []
    users.forEach(user => {
        list.push(new UserDisplayDTO(user))
    })
    res.json(list)
}

export const deleteIdle = async (req, res) => {
    let today = new Date()
    let deleted = []
    let users = await User.find()
    users.forEach(async user => {
        let lastLogin = new Date(user.lastConnection)
        let diff = Math.abs(today - lastLogin) / (1000*60*60*24)
        if (diff >= 2) {
            deleted.push(user._id)
        }
    })
    deleted.forEach(async id => {
        await User.deleteOne({_id: id})
    })
    res.send({status: "success", message: "Users deleted", payload: deleted})
}


export const modifyRole = async (req, res) => {
    let { email, role } = req.body
    let user = await User.findOne({email: email})
    if (!user) return res.status(404).json({status: "error", error: "Usuario no encontrado"})
    user.role = role
    await user.save()
    res.json({status: "success", message: `Rol cambiado a ${role}`})
}

export const deleteUser = async (req, res) => {
    let { email } = req.body
    let user = await User.findOne({email: email})
    if (!user) return res.status(404).json({status: "error", error: "Usuario no encontrado"})
    await User.deleteOne({email: email})
    res.json({status: "success", message: "Usuario eliminado"})
}