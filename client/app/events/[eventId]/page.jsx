'use client'
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import FeedLayout from "@/app/FeedLayout"
import axiosService from "@/lib/axiosService"
import { Calendar, MapPin, Users, Clock, ShieldCheck, Video, MoreHorizontal, MoreVertical, Loader2 } from "lucide-react"
import { formatSmartDate } from "@/lib/date"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { useToast } from "@/hooks/useToast"
import { joinEvent } from "@/store/features/events/eventsSlice"
import { useDispatch } from "react-redux"
import { useEvent } from "@/hooks/useEvent"

const EventPage = () => {
    const { eventId } = useParams()
    const [event, setEvent] = useState(null)
    const [loading, setLoading] = useState(true)

    const { isJoining } = useEvent()

    

    const toast = useToast()
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
            const event = await dispatch(joinEvent(eventId)).unwrap()
            console.log(event)
            setEvent(event)
            toast.success('event joined successfuly')
        } catch (err) {
            toast.error(err || 'Error')
        } finally {

        }
        }

    if (loading) return <FeedLayout><div className="p-8 text-center">Loading event...</div></FeedLayout>
    if (!event) return <FeedLayout><div className="p-8 text-center">Event not found.</div></FeedLayout>

    return (
        <FeedLayout>
            <div>
                {/* Header Section */}
                <header className="flex items-center justify-between border-b border-border pb-6 mb-8 ">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold">{event.name}</h1>
                        <div className="flex flex-wrap gap-6 text-gray-400">

                            
                            <div className="flex items-center gap-2">
                                <Calendar className="text-primary" />
                                <span>{formatSmartDate(new Date(event.start))}</span>
                            </div>
                            {event?.event_type === 'location' && <div className="flex items-center gap-2">
                                <MapPin className="text-primary" />
                                <span>{event.location}</span>
                            </div>}


                            {event?.event_type === 'virtual' && <div className="flex items-center gap-2">
                                <Video className="text-primary" />
                                <span>{event.meeting_link}</span>
                            </div>}
                        </div>
                    </div>

                    {event.isOwner && <Button variant="outline" className='aspect-square !p-2'><MoreVertical size={14}/></Button>}
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <section>
                            <h2 className="text-xl font-semibold mb-3">About this event</h2>
                            <p className="text-gray-500 leading-relaxed whitespace-pre-wrap">
                                {event.description || "No description provided for this event."}
                            </p>
                        </section>

                        {/* Extra Details Chips */}
                        <div className="flex flex-wrap gap-3">
                            {event.event_type && (
                                <span className="px-3 py-1 bg-primary/5 text-primary rounded-full text-xs font-medium uppercase tracking-wider">
                                    {event.event_type}
                                </span>
                            )}
                            {event.require_approval && (
                                <span className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-medium">
                                    <ShieldCheck className="w-3 h-3" /> Approval Required
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Sidebar / Action Card */}
                    <div className="divide-y divide-border sticky top-4">
                        {/* Author Info */}
                        <Link href={`/profile/${event.author.username}`} className="flex items-center gap-2 text-sm py-4">
                                <img 
                                className="size-10 rounded-lg object-cover border border-border" 
                                src={event.author.avatar} 
                                alt={event.author.displayName}
                                />
                                <div>
                                    <span className="block text-gray-400">presented by </span>
                                    <span>
                                    <span className="font-semibold text-foreground">{event.author.displayName}</span>
                                </span>
                                </div>
                                
                        </Link>
                        <div className="py-4">
                            <div className="mb-4">
                                <h3 className="text-lg font-bold mb-1">Registration</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Users className="w-4 h-4" />
                                    <span>
                                        {event.unlimited_capacity 
                                            ? "Unlimited spots available" 
                                            : `${event.capacity - (event.attendees?.length || 0)} spots remaining`}
                                    </span>
                                </div>
                            </div>
                                                    {event.isRegistered? true : false}
                            <Button disabled={event.isOwner || event.isRegistered || event.isExpired || isJoining} style={
                                {cursor : event.isOwner || event.isRegistered || event.isExpired  || isJoining? 'not-allowed' : 'pointer'}
                            } className={`w-full mb-4 justify-center ${event.isOwner || event.isRegistered || event.isExpired || isJoining ? "opacity-30 cursor-disabled" : 'opacity-100'}`} onClick={handleJoinEvent}>
                                {isJoining && <Loader2 className="animate-spin"/>}
                                
                                </Button>
                            
                            <div className="space-y-3 pt-4 border-t border-border text-sm">
                                <div className="flex justify-between">
                                    <span>Start Time:</span>
                                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">{new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>End Time:</span>
                                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">{new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FeedLayout>
    )
}

export default EventPage