import Event from "../models/Event.js";

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

        return res.json({
            message: "Event created successfully",
            event: savedEvent
        });

    } catch (err) {
        // Handle Mongoose Validation Errors
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};

export { createEvent };