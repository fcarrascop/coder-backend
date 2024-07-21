import ticketModel from "../models/ticket.model.js"
import { fecha, ticketCodeGenerator } from "../../../utils.js"
import ticketDTO from "../../DTOs/ticket.dto.js"

export default class TicketManager{
    async create(amount, purchaser){
        let date = fecha()
        let token = ticketCodeGenerator(date, purchaser, amount)
        let ticket = new ticketDTO(token, date, amount, purchaser)
        let newTicket = await ticketModel.create(ticket)
        return newTicket
    }

    async findByCode(code){
        let ticket = await ticketModel.findOne({code: code})
        if (ticket.length == 0) return ({error: "No se encontró el token"})
        return ticket
    }

    async findById(id){
        let ticket = await ticketModel.findById(id)
        if (ticket.length == 0) return ({error: "No se encontró el token"})
        return ticket
    }
}