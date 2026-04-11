import mongoose , { Schema } from "mongoose";

const EventTicketSchema = new Schema({
    user : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } ,
    event : { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true } ,
    scannedAt : { type : Date , default : null} ,
    status: { type: String, enum: ['valid', 'used'], default: 'valid' },
} , { timestamps: true })

const EventTicket = mongoose.model('EventTicket', EventTicketSchema);
export default EventTicket