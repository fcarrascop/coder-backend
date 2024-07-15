const socket = io()

function addProduct(){
    let title = document.getElementById("title").value ? document.getElementById("title").value : ""
    let description = document.getElementById("description").value ? document.getElementById("description").value : ""
    let price = document.getElementById("price").value ? document.getElementById("price").value : ""
    let thumbnail = document.getElementById("thumbnail").value ? document.getElementById("thumbnail").value : "Sin imagen"
    let code = document.getElementById("code").value ? document.getElementById("code").value : ""
    let stock = document.getElementById("stock").value ? document.getElementById("stock").value : 1
    let status = document.getElementById("status-false").checked ? "False" : "True"
    let category = document.getElementById("category").value ? document.getElementById("title").value : "categoria"

    if (!title || !description || !price || !code) {
        alert("Falta completar campos del formulario")
    }
    else{
        socket.emit("product", {
            "title": title,
            "description": description,
            "price": price,
            "thumbnail": thumbnail,
            "code": code,
            "stock": stock,
            "status": (status == "True" ? true : false),
            "category": category
        })
    }
}

function deleteProduct(id){
    socket.emit("delete", {"id": id})
}


socket.on("productList", (data)=>{
    let log = document.getElementById("list")
    let product = ""
    data.forEach((prod) => {
        product += `<li> <button id="${prod.id}" onclick="deleteProduct(${prod.id})">X</button>{ ${prod.id}, ${prod.title}, ${prod.description}, ${prod.price}, ${prod.thumbnail}, ${prod.code}, ${prod.stock}, ${prod.status}, ${prod.category} }</li>`
    });
    log.innerHTML = product
})

socket.on("error", (data)=>{
    alert(data.error)
})