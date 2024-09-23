function changePassword() {
    let div = document.getElementById("form");
    let button = document.getElementById("changePasswordButton");

    button.parentNode.removeChild(button);

    div.innerHTML += `
    <form id="changePasswordForm" action="/changepassword" method="POST">
        <label for="oldPassword" class="form-label">Contraseña antigua:</label><br>
        <input type="password" id="oldPassword" class="form-control" name="oldPassword" required><br>
        <label for="newPassword" class="form-label">Contraseña nueva:</label><br>
        <input type="password" id="password" class="form-control" name="newPassword" required><br>
        <label for="repeatPassword" class="form-label">Repetir contraseña:</label><br>
        <input type="password" class="form-control" name="repeatPassword" id="repeatPassword" required><br><br>
        <button type="submit" id="submit" disabled class="btn btn-outline-secondary btn-large">Cambiar Contraseña</button><br>
    </form>
    `

    const password = document.getElementById("password")
        const password2 = document.getElementById("repeatPassword")
        const submit = document.getElementById("submit")
        const passwordCriteria = document.createElement('div') 
        passwordCriteria.classList.add('password-criteria') 
        passwordCriteria.innerHTML = `
            <p>La contraseña debe tener:</p>
            <ul>
                <li id="length" class="invalid">Al menos 8 caracteres</li>
                <li id="uppercase" class="invalid">Una letra mayúscula</li>
                <li id="lowercase" class="invalid">Una letra minúscula</li>
                <li id="number" class="invalid">Un número</li>
                <li id="special" class="invalid">Un carácter especial</li>
            </ul>
        ` 
        password.parentElement.insertBefore(passwordCriteria, password.nextSibling) 
    
        function validatePassword() {
            if (password.value === password2.value && password.value !== "") {
                submit.disabled = false
            }
            else {
                submit.disabled = true
            }
        }
    
        function updateCriteria(criteria, valid) {
            const element = document.getElementById(criteria) 
            element.classList.toggle('invalid', !valid) 
            element.classList.toggle('valid', valid) 
        }
    
        function validatePasswordStrength() {
            const criteria = {
                length: password.value.length >= 8,
                uppercase: /[A-Z]/.test(password.value),
                lowercase: /[a-z]/.test(password.value),
                number: /[0-9]/.test(password.value),
                special: /[!@#$%^&*(),.?":{}|<>]/.test(password.value)
            } 
    
            updateCriteria('length', criteria.length) 
            updateCriteria('uppercase', criteria.uppercase) 
            updateCriteria('lowercase', criteria.lowercase) 
            updateCriteria('number', criteria.number) 
            updateCriteria('special', criteria.special) 
    
            return Object.values(criteria).every(Boolean) 
        }
    
        function validatePasswords() {
            const isPasswordStrong = validatePasswordStrength() 
            const passwordsMatch = password.value === password2.value && password.value !== "" 
            submit.disabled = !(isPasswordStrong && passwordsMatch) 
        }
    
        password.addEventListener("input", validatePasswords) 
        password2.addEventListener("input", validatePassword)
        
        function finish() {
            div.innerHTML = `
            <button id="changePasswordButton" class="btn btn-outline-secondary btn-large" onclick="changePassword()">Cambiar contraseña</button>
            `
        }

        const form = document.getElementById("changePasswordForm")
            form.addEventListener("submit", async function(event) {
                event.preventDefault()
                
                const data = {
                    newPassword: password.value,
                    oldPassword: document.getElementById("oldPassword").value
                }
                const response = await fetch(`${window.location.origin}/changepassword`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })

                let result = await response.json()
                

                if (result.status === "success") {
                    alert('Contraseña cambiada exitosamente')
                    finish()
                    
                } 
                else if (result.status === "error" && result.error === "Contraseñas iguales") {
                    alert('Nueva contraseña es igual a la anterior. Intente con otra contraseña.')
                }
                else {
                    alert('Error al cambiar la contraseña')
                }
            })
}

