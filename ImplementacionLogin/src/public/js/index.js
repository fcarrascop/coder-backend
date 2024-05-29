// se podría minificar todo esto.
async function addproduct(idProduct, idCart) {
    let cartId = idCart
    if (!cartId) {
        let response = await fetch("http://localhost:8080/api/carts", {method: "GET"})
        let id = 0
        let result = await response.json()
        console.log(result)
        result.payload.forEach((item)=>{ id = (item.id > id) ? item.id : id })
        cartId = id
    }
    
    const requestOptions = {
        method: "POST",
        redirect: "follow"
    };
    let response = await fetch(`http://localhost:8080/api/carts/${cartId}/products/${idProduct}`, requestOptions)

    let result = await response.json()
    alert(result.payload.message)

}