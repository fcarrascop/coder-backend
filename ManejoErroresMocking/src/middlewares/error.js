import EErrors from "../services/enum.js";

export  default (error, req, res, next) => {
    console.log(error.cause)

    switch (error.code) {
        case EErrors.ROUTING_ERROR:
            res.send({status: "error", error: error.name})
        
        case EErrors.INVALID_TYPES_ERROR:
            res.send({status: "error", error: error.name})
        
        case EErrors.INVALID_ID_PRODUCT_ERROR:
        res.send({status: "error", error: error.name})

        case EErrors.INVALID_ID_CART_ERROR:
            res.send({status: "error", error: error.name})
        
        case EErrors.EMAIL_ERROR:
            res.send({status: "error", error: error.name})
        
        case EErrors.INVALID_ID_TICKET_ERROR:
            res.send({status: "error", error: error.name})
        
        case EErrors.EXISTING_CODE_ERROR:
            res.send({status: "error", error: error.name})
    
        case EErrors.COOKIE_NOT_FOUND_ERROR:
            res.send({status: "error", error: error.name})
        
        default:
            res.send({status: "error", error: "Error no manejado"})
    }
}
