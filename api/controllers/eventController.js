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
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
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

        const eventRes = {
            ...event.toObject() , 
            isExpired : now > new Date(event.start) ,
            isRegistered: currentUserId ? event.attendees.some(a => a._id.toString() === currentUserId.toString()) : false ,
            isOwner: currentUserId ? event.author._id.toString() === currentUserId.toString() : false,
        }


        console.log(eventRes)
        return res.json(eventRes)
    }
    catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
        }
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

        if (!event.require_approval) {
            const ticket = await EventTicket.create({
                user : userId ,
                event : id , 
                approved : true 
            })   
        }

        const populatedEvent = await Event.findById(id)
        .populate('author', 'username avatar displayName followers')
        .populate('attendees', 'username avatar displayName') 

        

        const eventRes = {
            ...populatedEvent.toObject() , 
            isExpired : now > new Date(populatedEvent.start) ,
            isRegistered: userId ? populatedEvent.attendees.some(a => a._id.toString() === userId.toString()) : false ,
            isOwner: userId ? populatedEvent.author._id.toString() === userId.toString() : false,
        }

        return res.json(eventRes)
        

        
    }


     catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
}


export { createEvent , getEvents , getEventById , joinEvent};