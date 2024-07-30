export default class chatDTO {
    constructor (user) {
        this.name = user.firstName
        this.email = user.email
    }
}