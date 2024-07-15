// se podría minificar todo esto.
async function addproduct(idProduct, idCart) {
    const requestOptions = {
        method: "POST",
        redirect: "follow"
    };
    let response = await fetch(`http://localhost:8080/api/carts/${idCart}/products/${idProduct}`, requestOptions)
    let result = await response.json()
    if (result.payload) alert(result.payload.message)

}

async function clearCart(idCart) {
    const requestOptions = {
        method: "DELETE",
        redirect: "follow"
    };

    let response = await fetch(`http://localhost:8080/api/carts/${idCart}`, requestOptions)
    location.reload()
}

async function removeItem(id, cartId) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "DELETE",
        redirect: "follow"
    };

    let response = await fetch(`http://localhost:8080/api/carts/${cartId}/products/${id}`, requestOptions)
    location.reload()
}