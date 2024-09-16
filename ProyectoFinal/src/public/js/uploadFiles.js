function uploadFiles(){
    let div = document.getElementById("uploadFiles")

    div.innerHTML = `
    <form id="uploadFilesForm" action="/upload" method="post" enctype="multipart/form-data">
        <label class="form-label" for="documentType">Tipo de documento:</label><br>
        <select class="form-control" name="documentType" id="documentType">
            <option value="identification">Identificación</option>
            <option value="proof_of_address">Comprobante de domicilio</option>
            <option value="account_statement">Comprobante estado de cuenta</option>
        </select><br><br>

        <input class="form-control" type="file" name="document" /><br><br>
        <button type="submit" class="btn btn-outline-secondary btn-large">Subir</button>
    </form>
    `
    const form = document.getElementById("uploadFilesForm")
    form.addEventListener("submit", (event) => {
        event.preventDefault()
        let uid = document.getElementById("token").innerText
        const formData = new FormData(form)
        fetch(`/api/users/${uid}/documents`, {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data)
        })
    })
}
