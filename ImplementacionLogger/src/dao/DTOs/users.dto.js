export class userDTO {
    constructor(firstName, lastName, email, age, password, cartId) {
        this.firstName = firstName,
        this.lastName = lastName,
        this.email = email,
        this.age = age,
        this.password = password,
        this.role = "user",
        this.cartId = cartId
    }
}

export class sessionDTO {
    constructor(user){
        this._id = user._id
        this.firstName = user.firstName
        this.lastName = user.lastName
        this.email = user.email
        this.role = user.role
        this.cartId = user.cartId
    }
}

export class currentDTO {
    constructor(user) {
        this._id = user.data._id
        this.firstName = user.data.firstName
        this.lastName = user.data.lastName
        this.role = user.data.role
        this.cartId = user.data.cartId
    }
}