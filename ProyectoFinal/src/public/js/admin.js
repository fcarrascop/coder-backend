async function editRole(email) {
    let role = document.getElementById(`role-${email}`).value
    let data = {
        email: email,
        role: role
    }
    const requestOptions = {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data), 
        redirect: "follow"
    };

    let response = await fetch(`${window.location.origin}/api/users/role`, requestOptions)
    let result = await response.json()
    if (result.status === "error") {
        alert(result.error)
    }
    else {
        alert(result.message)
        location.reload()
    }
}

async function deleteUser(email) {
    let data = {
        email: email
    }
    const requestOptions = {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data), 
        redirect: "follow"
    };

    let response = await fetch(`${window.location.origin}/api/users/one`, requestOptions)
    let result = await response.json()
    if (result.status === "error") {
        alert(result.error)
    }
    else {
        alert(result.message)
        location.reload()
    }
    
}

async function deleteIde() {
    const requestOptions = {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: "follow"
    };

    let response = await fetch(`${window.location.origin}/api/users`, requestOptions)
    let result = await response.json()
    alert(result.message)
    location.reload()
}