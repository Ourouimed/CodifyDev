'use client'
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import FeedLayout from "@/app/FeedLayout"
import axiosService from "@/lib/axiosService"
import { Calendar, MapPin, Users, ShieldCheck, Video, Loader2, CheckCircle2, ExternalLink, X, Check, Trash2 } from "lucide-react"
import { formatSmartDate } from "@/lib/date"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { useToast } from "@/hooks/useToast"
import { accept_attendee, joinEvent } from "@/store/features/events/eventsSlice"
import { useDispatch } from "react-redux"
import { useEvent } from "@/hooks/useEvent"
import QRCode from "react-qr-code"
import { usePopup } from "@/hooks/usePopup"

const EventPage = () => {
    const { eventId } = useParams()
    const [event, setEvent] = useState(null)
    const [loading, setLoading] = useState(true)

    const { isJoining , isAccepting} = useEvent()
    const toast = useToast()
    const { openPopup } = usePopup()
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true)
                const res = await axiosService.get(`/api/events/event/${eventId}`)
                setEvent(res.data)
            } catch (error) {
                console.error("Error fetching event:", error)
            } finally {
                setLoading(false)
            }
        }

        if (eventId) fetchEvent()
    }, [eventId])

    const handleJoinEvent = async () => {
        try {
            const updatedEvent = await dispatch(joinEvent(eventId)).unwrap()
            setEvent(updatedEvent)
            toast.success('Successfully registered for the event!')
        } catch (err) {
            toast.error(err || 'Failed to join event')
        }
    }


    const handleAcceptEventAttendee = async (id) => {
        try {
            const updatedEvent = await dispatch(accept_attendee({eventId , userId : id})).unwrap()
            setEvent(updatedEvent)
            toast.success('Successfully registered for the event!')
        } catch (err) {
            toast.error(err || 'Failed to join event')
        }
    }

    const getButtonContent = () => {
        if (isJoining) return <><Loader2 size={14} className="animate-spin" /> Processing...</>
        if (event.isOwner) return "You are the Host"
        if (event.isRegistered) return <><CheckCircle2 size={14} /> Registered</>
        if (event.isExpired) return "Registration ended"
        return "Register now"
    }



    if (loading) return <FeedLayout><div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="animate-spin text-primary" /></div></FeedLayout>
    if (!event) return <FeedLayout><div className="p-8 text-center text-gray-500">Event not found.</div></FeedLayout>

    const isDisabled = event.isOwner || event.isRegistered || event.isExpired || isJoining

    return (
        <FeedLayout>
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-6 mb-8 gap-4">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight">{event.name}</h1>
                        <div className="flex flex-wrap gap-6 text-gray-400">
                            <div className="flex items-center gap-2">
                                <Calendar className="text-primary size-5" />
                                <span>{formatSmartDate(new Date(event.start))}</span>
                            </div>
                            {event?.event_type === 'location' && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="text-primary size-5" />
                                    <span>{event.location}</span>
                                </div>
                            )}
                            {event?.event_type === 'virtual' && (
                                <div className="flex items-center gap-2">
                                    <Video className="text-primary size-5" />
                                    <span className="capitalize">{event.event_type}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {event.isOwner && (
                        <Button 
                            onClick={()=> openPopup({title : 'Delete event' , component : 'DeleteEventPopup' , props : {
                                id : event._id , name : event.name
                            }})}
                            variant="outline" size="sm" className="shrink-0 !border-red-500 !text-red-500 hover:!bg-red-500 hover:!text-white" >
                            Delete event
                            <Trash2 size={18} />
                        </Button>
                    )}
                </header>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
                    {/* Left Content */}
                    <div className="md:col-span-3 space-y-12">
                        <section>
                            <h2 className="text-xl font-semibold mb-4 text-foreground">About this event</h2>
                            <p className="text-gray-500 leading-relaxed whitespace-pre-wrap">
                                {event.description || "No description provided for this event."}
                            </p>
                        </section>

                        {/* Google Maps Section */}
                        {event?.event_type === 'location' && event.location && (
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-foreground">Location</h2>
                                    <a 
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-primary flex items-center gap-1 hover:underline font-medium"
                                    >
                                        Get Directions <ExternalLink size={12} />
                                    </a>
                                </div>
                                <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-border shadow-sm bg-secondary/10">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        loading="lazy"
                                        allowFullScreen
                                        referrerPolicy="no-referrer-when-downgrade"
                                        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(event.location)}`}
                                    ></iframe>
                                </div>
                            </section>
                        )}

                        
                    </div>

                    {/* Right Sidebar */}
                    <aside className="space-y-4 col-span-2 sticky top-4">
                        {event.isRegistered && event?.ticket?._id && (
                            <div className="p-4 rounded-xl border border-border flex flex-col items-center gap-4 shadow-sm bg-card">
                                <div className="w-full flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Your Entry Ticket</span>
                                    <CheckCircle2 size={16} className="text-green-500" />
                                </div>
                                
                                <div className="p-4 bg-white rounded-lg border border-gray-100">
                                    <QRCode 
                                        value={`${window.location.origin}/events/check_ticket/${event.ticket._id.toString()}`} 
                                        size={160}
                                        level="M" 
                                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    />
                                </div>
                                
                                <p className="text-[10px] font-mono text-gray-400 break-all text-center">
                                    ID: {event.ticket._id.toString()}
                                </p>
                            </div>
                        )}

                        <div className="p-4 rounded-xl border border-border bg-card">
                            {/* Author */}
                            <Link href={`/profile/${event.author.username}`} className="flex items-center gap-3 mb-6 group">
                                <img 
                                    className="size-12 rounded-full object-cover border-2 border-transparent group-hover:border-primary transition-all" 
                                    src={event.author.avatar} 
                                    alt={event.author.displayName}
                                />
                                <div>
                                    <span className="block text-xs text-gray-400">Hosted by</span>
                                    <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                                        {event.author.displayName}
                                    </span>
                                </div>
                            </Link>

                            {event.require_approval && (
                                <span className="flex items-center gap-1 mb-4 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-medium w-fit">
                                    <ShieldCheck size={14}/> Approval Required
                                </span>
                            )}

                            {/* Meeting Link (Only if registered or owner) */}
                            {(event.isRegistered || event.isOwner) && event.meeting_link && (
                                <div className="mb-6">
                                    <Link href={event.meeting_link} target="_blank" className="p-3 border border-border flex items-center gap-3 rounded-lg hover:bg-secondary/50 transition-colors">
                                        <div className="p-2 rounded-md bg-primary/10">
                                            <Video size={18} className="text-primary"/>
                                        </div>
                                        <div className="overflow-hidden">
                                            <span className="text-xs font-medium block">Join Meeting</span>
                                            <span className="text-xs block text-primary truncate">{event.meeting_link}</span>
                                        </div>
                                    </Link>
                                </div>
                            )}

                            {/* Registration Info */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Registration</h3>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        <span className="font-medium text-foreground">
                                            {event.unlimited_capacity 
                                                ? "Unlimited spots" 
                                                : `${event.capacity - (event.attendees?.length || 0)} spots remaining`}
                                        </span>
                                    </div>
                                </div>

                               {!event.isOwner && (
                                    <Button 
                                        disabled={isDisabled} 
                                        onClick={handleJoinEvent}
                                        className={`w-full justify-center transition-all ${event.isRegistered ? 'bg-green-600 hover:bg-green-700' : ''} ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
                                    >
                                        {getButtonContent()}
                                    </Button>
                               )} 

                                <div className="space-y-3 pt-4 border-t border-border text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Starts</span>
                                        <span className="font-mono font-medium bg-secondary px-2 py-1 rounded text-xs text-foreground">
                                            {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Ends</span>
                                        <span className="font-mono font-medium bg-secondary px-2 py-1 rounded text-xs text-foreground">
                                            {new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl border border-border bg-card space-y-4">
                            <h4 className="font-semibold">Attendees </h4>
                            <div className="divide-y divide-border">
                                {event?.attendees.map(a => {
                                    
                                    const isApproved = !event?.require_approval || event?.tickets.some(e => e.user.toString() === a._id.toString())
                                    return (
                                    <div key={a._id} className="p-2 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <img src={a.avatar} className="size-8 rounded-full"/>
                                        <div>
                                            <span className="font-semibold text-sm block">{a.displayName}</span>
                                            <span className="text-xs text-gray-400 block">@{a.username}</span>
                                        </div>
                                    </div>
                                    {event.isOwner ?
                                     !isApproved ?
                                      <div className="flex items-center gap-2">
                                        <button className=
                                                {`text-green-500 border border-green-500 border border-green-500 p-2 ${isAccepting ? 'opacity-30' : 'opacity-100'}
                                                    cursor-pointer rounded-md hover:bg-green-500 hover:text-white transition duration-300`}
                                                onClick={()=>handleAcceptEventAttendee(a._id)}
                                                disabled={isAccepting}>
                                                {isAccepting ? <Loader2 className="animate-spin" size={14}/> : <Check size={14}/>}
                                        </button>
                                      </div>
                                      : <span className="px-4 py-1 text-xs rounded-full bg-green-500/30 text-green-500 border border-green-500">approved</span>
                                    : 
                                    !isApproved ? <span className="px-4 py-1 text-xs rounded-full bg-yellow-500/30 text-yellow-500 border border-yellow-500">pending</span> 
                                    : <span className="px-4 py-1 text-xs rounded-full bg-green-500/30 text-green-500 border border-green-500">approved</span>
                                    }
                                    
                                </div>)
                            })}
                            </div>
                            
                        </div>
                    </aside>
                </div>
            </div>
        </FeedLayout>
    )
}

export default EventPage