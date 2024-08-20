document.addEventListener("DOMContentLoaded", () => {
    const socket = io();
    let user = document.getElementById("user").innerText;

    let chatBox = document.getElementById("chatBox");

    chatBox.addEventListener("keyup", (e) => {
        if (e.key === "Enter" && chatBox.value.trim().length > 0) {
            sendMessage();
        }
    });

    // Recibir mensaje del socket
    socket.on("messageUpdate", (data) => {
        let log = document.getElementById("chat");
        let messages = "";
        data.forEach((men) => {
            messages += `<li><strong>${men.user}:</strong> ${men.message}</li>`;
        });
        log.innerHTML = messages;
    });

    // Mandar mensaje al socket
    window.sendMessage = function() {
        let message = chatBox.value;
        if (message) {
            socket.emit("message", { "user": user, "message": message });
            chatBox.value = "";
        }
    };
});
