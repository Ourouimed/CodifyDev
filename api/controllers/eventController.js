import { sendEventConfirmationEmail } from "../lib/send-email.js";
import Event from "../models/Event.js"; 
import EventTicket from "../models/EventTicket.js";


const createEvent = async (req, res) => {
    try {
        const { 
            name, 
            start, 
            end, 
            event_type, 
            location, 
            meeting_link, 
            description, 
            unlimited_capacity, 
            capacity, 
            require_approval 
        } = req.body;

        if (!name || !start || !end || !event_type) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        if (new Date(start) >= new Date(end)) {
            return res.status(400).json({ error: "End date must be after start date." });
        }


        const savedEvent = await Event.create({
            name,
            start,
            end,
            event_type,
            location: event_type === 'location' ? location : undefined,
            meeting_link: event_type === 'virtual' ? meeting_link : undefined,
            description,
            unlimited_capacity,
            capacity: unlimited_capacity ? undefined : capacity,
            require_approval ,
            author : req.user.id
        })

        const populatedEvent = await Event.findById(savedEvent._id)
        .populate('author', 'username avatar displayName followers')
        .populate('attendees', 'username avatar displayName')

        return res.json({
            message: "Event created successfully",
            event: populatedEvent
        });

    } catch (err) {
        console.log(err)
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};


const getEvents = async (req, res) => {
  try {
    const userId = req.user.id; 
    const now = new Date()
    // get upcomming events
    const uppcommingEvents = await Event.find({ start : {$gte : now}})
      .populate('author', 'username avatar displayName followers')
      .populate('attendees', 'username avatar displayName')
      .sort({ start: 1 }) 
      .lean();

    // get past events
    const pastEvents = await Event.find({ start : {$lt : now}})
      .populate('author', 'username avatar displayName followers')
      .populate('attendees', 'username avatar displayName')
      .sort({ start: -1 }) 
      .lean();


    // get events based on user id
    const myEvents = await Event.find({
        $or : [
            { author : userId } ,
            { attendees : userId}
        ]
    })
      .populate('author', 'username avatar displayName followers')
      .populate('attendees', 'username avatar displayName')
      .sort({ start: 1 }) 
      .lean();

    return res.json({ events : {
        uppcomming : uppcommingEvents ,
        past : pastEvents ,
        myEvents : myEvents
    } });
  }   catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }  
};

const getEventById = async (req , res)=>{
    try {
        const { id } = req.params
        const currentUserId = req.user.id
        const now = new Date() 

        if (!id)  return res.status(400).json({ error: "Missing required fields." });

        const event = await Event.findById(id)
        .populate('author', 'username avatar displayName followers')
        .populate('attendees', 'username avatar displayName')

        if (!event) return res.status(404).json({
            error : 'event not found'
        })



        const isRegistered = event.attendees.some(a => a._id.toString() === currentUserId.toString())
        const isOwner = event.author._id.toString() === currentUserId.toString()



        const [ticket] = await EventTicket.find({user : currentUserId , event : event._id})

        // all tickets available 
        const tickets = await EventTicket.find({event : id} , { _id : 1 , user : 1 })
        const eventRes = {
            ...event.toObject() , 
            isExpired : now > new Date(event.start) ,
            isRegistered ,
            isOwner, 
            tickets : tickets || [],
            ...(ticket && {ticket : ticket.toObject()}) ,
            ...(isRegistered || isOwner && {meeting_link : event.meeting_link}), 
            
        }

        return res.json(eventRes)
    }
     catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }  
}


const joinEvent = async (req , res)=>{
    try {
        const { id } = req.params
        const userId = req.user.id
        const now = new Date()

        if (!id)  return res.status(400).json({ error: "Missing required fields." });

        const event = await Event.findById(id)
        if (!event) return res.status(404).json({error : 'Event not found'}) 

        const isRegistered = event.attendees.some(a => a._id.toString() === userId.toString())
        
        const isOwner = event.author._id.toString() === userId.toString()


        if (isRegistered || isOwner) return res.status(400).json({error : 'You are already registred'})

        const isExpired = now > new Date(event.start)
        if(isExpired) return res.status(400).json({error : 'Event is expired'})


        if (!event.unlimited_capacity && event.capacity <= event.attendees.length) return res.status(400).json({error : 'Max capacity attended'})
        

        await Event.findByIdAndUpdate(id, {
            $push : {
                attendees : userId
            }, } , {new : true}) 

        let ticket
        if (!event.require_approval) {
            const {_id} = await EventTicket.create({
                user : userId ,
                event : id , 
            })   

            const [tkt] = await EventTicket.find(_id).populate('user' , 'username displayName email')
            ticket = tkt
            if (ticket.user.email) await sendEventConfirmationEmail(ticket.user , event)
        }
        


        const populatedEvent = await Event.findById(id)
        .populate('author', 'username avatar displayName followers')
        .populate('attendees', 'username avatar displayName') 

        
        // all tickets available 
        const tickets = await EventTicket.find({event : id} , { _id : 1 , user : 1 }) 
        const eventRes = {
            ...populatedEvent.toObject() , 
            ...(ticket && {ticket: ticket.toObject()}) , 
            tickets ,
            isExpired : now > new Date(populatedEvent.start) ,
            isRegistered: userId ? populatedEvent.attendees.some(a => a._id.toString() === userId.toString()) : false ,
            isOwner: userId ? populatedEvent.author._id.toString() === userId.toString() : false,
            ...(isRegistered || isOwner && {meeting_link : event.meeting_link}), 
        }


        return res.json(eventRes)
        
    }


      catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }  
}


const acceptEventAttendee = async (req , res)=>{
    try {
        const { eventId } = req.params
        const { userId } = req.body
        const ownerId = req.user.id
        
        const now = new Date()
        
        
        if (!userId || !eventId) return res.status(400).json({error : 'Some required fields are missing'})

        const event = await Event.findById(eventId)
        if(!event) return res.status(404).json({error : 'Event not found'})


        if (ownerId !== event.author.toString()) return res.status(403).json({error : 'Your do not have acces to this action'})

        const user = await Event.find({ attendees : userId })
        if(!user) return res.status(404).json({error : 'User not registred in this event'})

        const [existingTicket] = await EventTicket.find({user :userId , event : eventId})
        if (existingTicket) return res.status(400).json({error : 'User Already accepted'}) 


        const {_id} = await EventTicket.create({
            user : userId ,
            event : eventId , 
        })   

        const [ticket] = await EventTicket.find(_id).populate('user' , 'username displayName email')
        if (ticket.user.email) await sendEventConfirmationEmail(ticket.user , event)


        


        


        const populatedEvent = await Event.findById(eventId)
        .populate('author', 'username avatar displayName followers')
        .populate('attendees', 'username avatar displayName') 


        const isRegistered = populatedEvent.attendees.some(a => a._id.toString() === userId.toString())
        const isOwner = populatedEvent.author._id.toString() === userId.toString()
        const isExpired = now > new Date(populatedEvent.start)

        // all tickets available 
        const tickets = await EventTicket.find({event : eventId} , { _id : 1 , user : 1 }) 

        const eventRes = {
            ...populatedEvent.toObject() , 
            tickets ,
            isExpired  ,
            isRegistered ,
            isOwner ,
            ...(isRegistered || isOwner && {meeting_link : populatedEvent.meeting_link}), 
        }


        return res.json(eventRes)
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }  
}


const getTicketDetails = async (req, res) => {
    try {
        const { id } = req.params
        const ticket = await EventTicket.findById(id)
            .populate('user', 'displayName username avatar')
            .populate('event', 'name start end author');

        if (!ticket) return res.status(404).json({ error: "Ticket not found" });
        
        if (ticket.event.author.toString() !== req.user.id.toString()) {
            return res.status(403).json({ error: "Unauthorized access" });
        }

        return res.json(ticket);
    }  catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }  
};


const verifyTicket = async (req, res) => {
    try {
        const { id } = req.params
        const ticket = await EventTicket.findById(id);

        if (!ticket) return res.status(404).json({ error: "Invalid Ticket" });
        
        if (ticket.status === 'used') {
            return res.status(400).json({ 
                message: "Ticket already used", 
                scannedAt: ticket.scannedAt 
            });
        }

        ticket.status = 'used';
        ticket.scannedAt = new Date();
        await ticket.save();

        const updatedTicket = await EventTicket.findById(ticket._id)
            .populate('user', 'displayName username avatar')
            .populate('event', 'name start end author');

        res.json(updatedTicket);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }  
};

export { createEvent , getEvents , getEventById , joinEvent , getTicketDetails , verifyTicket , acceptEventAttendee};