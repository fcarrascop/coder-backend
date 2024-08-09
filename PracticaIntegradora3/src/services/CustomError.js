export default class CustomError{
    static createError({name = "Error", message, code = 1}){
        const error = new Error(message)
        error.name = name
        error.code = code
        throw error
    }
}