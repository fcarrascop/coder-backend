// se podría minificar todo esto.

async function addproduct(idProduct) {
    const requestOptions = {
        method: "POST",
        redirect: "follow"
    };
    let response = await fetch(`http://localhost:8080/api/cart/products/${idProduct}`, requestOptions)
    let result = await response.json()
    if (result.payload) alert(result.payload.message)

}

async function clearCart() {
    const requestOptions = {
        method: "PUT",
        redirect: "follow"
    };

    let response = await fetch(`http://localhost:8080/api/cart`, requestOptions)
    location.reload()
}

async function removeItem(id) {
    const requestOptions = {
        method: "DELETE",
        redirect: "follow"
    };

    let response = await fetch(`http://localhost:8080/api/cart/products/${id}`, requestOptions)
    location.reload()
}

async function purchase() {
    const requestOptions = {
        method: "POST",
        redirect: "follow"
    };
    let response = await fetch(`http://localhost:8080/api/cart/purchase`, requestOptions)
    let result = await response.json()
    console.log(result.payload)
    if (result.status !== "success") return alert("Error al realizar la compra")
    location.replace(`http://localhost:8080/cart/purchased/${result.payload.code}`)
}

async function userData() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    let response = fetch("http://localhost:8080/cart", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}