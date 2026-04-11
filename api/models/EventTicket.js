import mongoose , { Schema } from "mongoose";

const EventTicketSchema = new Schema({
    user : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } ,
    event : { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true } ,
    approved : { type : Boolean , default : false}
} , { timestamps: true })

const EventTicket = mongoose.model('EventTicket', EventTicketSchema);
export default EventTicket