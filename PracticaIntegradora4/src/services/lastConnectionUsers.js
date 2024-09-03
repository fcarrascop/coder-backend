import User from "../dao/mongo/models/user.model.js";

export const lastConnectionUser = async (email) => {
    let user = await User.findOne({email: email})
    let date = new Date()
    let response = await User.updateOne({email: user.email}, {lastConnection: date})
    return response
}