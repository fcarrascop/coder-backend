// Conexión socket
const socket = io()

let user
let chatBox

// Función login + comprobación email
function login() {
    let login = document.getElementById("logging")
    let chat = document.getElementById("inputChat")
    let email = document.getElementById("email").value
    if (email && email.includes("@") && email.includes(".com") && email.split("@")[0].length !== 0 && email.split("@")[1].length !== 0) {
        user = email
        login.innerHTML = `<h2>Logeado</h2>`
        chat.innerHTML += `<div class="col-10"> <input type="text" id="chatBox"></div> <div class="col-2"> <button onclick="sendMessage()">Enviar</button> </div>`
        chatBox = document.getElementById("chatBox")
        chatBox.addEventListener("keyup", (e)=>{
            if (e.key === "Enter" && chatBox.value.trim().length > 0) {
                sendMessage()
            }
        })
    }
    else {
        alert("Ingresa un email válido!")
    }
}

// Mandar mensaje al socket
function sendMessage() {
    let message = document.getElementById("chatBox").value
    if (message) {
        socket.emit("message", {"user": user, "message": message})
        chatBox.value = ""
    }
}

// Recibir mensaje del socket
socket.on("messageUpdate", (data)=>{
    let log = document.getElementById("chat")
    let messages = ""
    data.forEach((men)=>{
        messages += `<li>${men.user}: ${men.message}</li>`
    })
    log.innerHTML = messages
})