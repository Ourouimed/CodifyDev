import { useState, useEffect } from "react";
import { Input } from "../ui/Input";
import DateTimePicker from "../ui/DateTimePicker";
import { Calendar, Link, MapPin, Video } from "lucide-react";
import { TextArea } from "../ui/TextArea";
import { Button } from "../ui/Button";
import SwitchBtn from "../ui/SwitchBtn";
import { useDispatch } from "react-redux";
import { useToast } from "@/hooks/useToast";
import { usePopup } from "@/hooks/usePopup";
import Select from "../ui/Select";
import { timezones } from "@/lib/timezone";

const CreateEventPopup = () => {
  const [event, setEvent] = useState({
    name: '',
    timezone: 'UTC', 
    start: new Date(),
    end: new Date(new Date().setHours(new Date().getHours() + 1)),
    event_type: 'location',
    location: '', 
    meeting_link : '',
    description: '',
    unlimited_capacity: true, 
    capacity : 50,
    require_approval: false,
  });
  
  const [validationErrors, setValidationErrors] = useState({}); 

  const { closePopup } = usePopup();
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    try {
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (userTimezone) {
        setEvent(prev => ({ ...prev, timezone: userTimezone }));
      }
    } catch (e) {
      console.warn("Could not detect browser timezone, defaulting to UTC.");
    }
  }, []);

  const handleDateChange = (field, val) => {
    const newDate = new Date(`${val.date}T${val.time}`);
    const currentDate = event[field];
    const currentTimestamp = currentDate instanceof Date ? currentDate.getTime() : currentDate;

    if (currentTimestamp !== newDate.getTime()) {
      setEvent(prev => ({ ...prev, [field]: newDate }));
    }
  };

  const handleValidate = () => {
    const errors = {};
    if (!event.name.trim()) errors.name = "Event name is required";
    if (event.event_type === 'location' && !event.location.trim()) errors.location = "Location is required";
    if (event.event_type === 'virtual' && !event.meeting_link.trim()) errors.meeting_link = "Meeting link is required";
    if (event.start >= event.end) errors.dates = "End date must be after start date";
    if (!event.unlimited_capacity && event.capacity < 3) errors.capacity = "event capacity must be at least 3"
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setEvent((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCreateEvent = async () => {
    if (!handleValidate()) return;

    try {
      // Dispatch your action here
      // await dispatch(createEventAction(event));
      toast.success("Event created successfully!");
      closePopup();
    } catch (err) {
      toast.error("Failed to create event. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-2xl">Create New Event</h3>
        <p className="text-sm text-gray-400">Fill in the details to launch your event.</p>
      </div>
      
      <div className="space-y-4">
        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Event Name</label>
          <Input 
            id='name' 
            placeholder='e.g. Gitex Africa' 
            onChange={handleChange} 
            value={event.name} 
          />
          {validationErrors.name && <span className="text-xs text-red-500">{validationErrors.name}</span>}
        </div>

        {/* Timezone */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Timezone</label>
          <Select 
            value={{value : event.timezone , label : event.timezone}} 
            options={timezones} 
            onChange={opt => setEvent(prev => ({...prev, timezone: opt.value}))}
          />
        </div>

        {/* Dates */}
        <div className="space-y-1">
            <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Start Date</label>
                <DateTimePicker 
                date={event.start} 
                onDateTimeChange={(val) => handleDateChange('start', val)}
                />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">End Date</label>
                <DateTimePicker 
                date={event.end} 
                onDateTimeChange={(val) => handleDateChange('end', val)}
                />
            </div>
            </div>
            {validationErrors.dates && <span className="text-xs text-red-500">{validationErrors.dates}</span>}
        </div>
        

        {/* Type Selector */}
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Event type</label>
            <div className="flex items-center gap-2">
                <Button variant="outline" 
                        className={`flex-1 ${event.event_type === 'location' ? '!bg-green-500/10 border-green-500': ''}`}
                        onClick={() => setEvent(prev => ({...prev , event_type : 'location'}))}>
                    <div className="size-10 p-2 flex items-center text-green-500 border border-border bg-border/40 rounded-md">
                        <MapPin size={20}/>
                    </div>
                    Location
                </Button>
                <Button variant="outline" 
                    className={`flex-1 ${event.event_type === 'virtual' ? '!bg-primary/10 border-primary': ''}`}
                    onClick={() => setEvent(prev => ({...prev , event_type : 'virtual'}))}>
                    <div className="size-10 p-2 flex items-center text-primary border border-border bg-border/40 rounded-md">
                        <Video size={20}/>
                    </div>
                    Virtual
                </Button>
            </div>
        </div>

        {/* Dynamic Inputs based on type */}
        {event.event_type === 'location' && (
          <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Event location</label>
              <Input icon={MapPin} 
                     id='location'
                     placeholder='Rabat, Morocco'
                     value={event.location} 
                     onChange={handleChange}
              />
              {validationErrors.location && <span className="text-xs text-red-500">{validationErrors.location}</span>}
          </div>
        )}

        {event.event_type === 'virtual' && (
          <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Join URL</label>
              <Input icon={Link} 
                     placeholder='Google Meet, Discord, Zoom link...' 
                     value={event.meeting_link} 
                     id='meeting_link'
                     onChange={handleChange}
              />
              {validationErrors.meeting_link && <span className="text-xs text-red-500">{validationErrors.meeting_link}</span>}
          </div>
        )}

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Description</label>
          <TextArea 
            id="description"
            placeholder="Tell us more about the event..."
            onChange={handleChange}
            value={event.description}
          />
        </div>

        {/* Event Options Card */}
        <div className="flex flex-col gap-1">
            <h4 className="font-bold">Event options</h4>
            <div className="border border-border rounded-lg divide-y divide-border">
                <div className="flex items-center justify-between gap-1 p-4">
                    <label className="text-sm font-medium">Admin approval</label>
                    <SwitchBtn 
                      isOn={event.require_approval} 
                      onToggle={() => setEvent(prev =>({ ...prev, require_approval: !prev.require_approval }))}
                    />
                </div>  

                <div className="p-4 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                        <label className="text-sm font-medium">Unlimited capacity</label>
                        <SwitchBtn 
                          isOn={event.unlimited_capacity} 
                          onToggle={() => setEvent(prev =>({ ...prev, unlimited_capacity: !prev.unlimited_capacity }))}
                        />
                    </div>  
                    {!event.unlimited_capacity && (
                      <div className="flex flex-col gap-1 mt-2">
                          <label className="text-xs font-medium">Event capacity</label>
                          <Input min={1} type='number' value={event.capacity} id='capacity' onChange={handleChange}/>   
                          {validationErrors.capacity && <span className="text-xs text-red-500">{validationErrors.capacity}</span>} 
                      </div>
                    )}
                </div>
            </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={closePopup}>Cancel</Button>
            <Button onClick={handleCreateEvent}> Create Event <Calendar size={14} className="ml-2"/></Button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPopup;