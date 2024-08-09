document.addEventListener('DOMContentLoaded', (event) => {
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
})