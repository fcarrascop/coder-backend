// se podría minificar todo esto.

async function addproduct(idProduct) {
    const requestOptions = {
        method: "POST",
        redirect: "follow"
    };
    let response = await fetch(`${window.location.origin}/api/cart/products/${idProduct}`, requestOptions)
    let result = await response.json()
    if (result.status !== "success") return alert(result.error)
    alert(result.payload.message)
}

async function clearCart() {
    const requestOptions = {
        method: "PUT",
        redirect: "follow"
    };

    let response = await fetch(`${window.location.origin}/api/cart`, requestOptions)
    location.reload()
}

async function removeItem(id) {
    const requestOptions = {
        method: "DELETE",
        redirect: "follow"
    };

    let response = await fetch(`${window.location.origin}/api/cart/products/${id}`, requestOptions)
    location.reload()
}

async function purchase() {
    const requestOptions = {
        method: "POST",
        redirect: "follow"
    };
    let response = await fetch(`${window.location.origin}/api/cart/purchase`, requestOptions)
    let result = await response.json()
    if (result.status !== "success") return alert("Error al realizar la compra")
    location.replace(`${window.location.origin}/cart/purchased/${result.payload.code}`)
}
