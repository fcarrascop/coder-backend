// Cart
export const productsCartError = (id) => {
    return `
        Error al introducir el producto id: ${id}.
        Producto no se encontró en la base de datos.
    `
}

export const getCartError = (id) => {
    return `
        Error al introducir el id (${id}) del carrito. No se encontró en la base de datos.
    `
}

export const getCartIdError = (id) => {
    return `
        Error al introducir el _id (${id}) del carrito. No se encontró en la base de datos.
    `
}

export const getTicketError = (type, code) => {
    switch (type){
        case "id":
            return `Error al encontrar el ticket.
            Id (${code}) inválido.`
        case "code":
            return `Error al encontrar el ticket.
            Código (${code}) inválido.`
    }
}

export const productInfoError = (title, description, price, code, stock, category) => {
    return `
    Error al crear el producto, datos no válidos.
    - title tiene que ser un string (máx 80 caract). Se recibió ${title}.
    - description tiene que ser un string (máx 120 caract). Se recibió ${description}.
    - price tiene que ser un número. Se recibió ${price}.
    - code tiene que ser un string (máx 40 caract). Se recibió ${code}.
    - stock tiene que ser un número. Se recibió ${stock}.
    - category tiene que ser un string (máx 120 caract). Se recibió ${category}.`
}

export const productCodeError = (code) => {
    return `Código (${code}) ya lo tiene otro producto. Pruebe con otro código.`
}