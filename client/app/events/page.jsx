'use client'
import { Button } from "@/components/ui/Button"
import FeedLayout from "../FeedLayout"
import { Calendar, Plus } from "lucide-react"
import { usePopup } from "@/hooks/usePopup"
import { useEffect, useState } from 'react'
import { useDispatch } from "react-redux"
import { getEvents } from "@/store/features/events/eventsSlice"
import { useEvent } from "@/hooks/useEvent"
import { EventCard } from "@/components/cards/EventCard"

const Events = ()=>{
    const { openPopup } = usePopup()
    const dispatch = useDispatch()
    const filters = [{text : 'uppcomming' ,icon : Calendar} , {text : 'past' ,icon : Calendar} , {text : 'myEvents' ,icon : Calendar}]
    const [filterType , setFilterType] = useState(filters[0].text)
    const { isLoading , events } = useEvent()
    

    useEffect(()=>{
        dispatch(getEvents())
    } , [])

    const handleOpenEventPopup = ()=>{
        openPopup({title : 'Create event' , component : 'CreateEventPopup'})
    }

    if (isLoading) return <FeedLayout>
        Loading events...
    </FeedLayout>
    return <FeedLayout>
        <div>
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Events
                    </h1> 
                    <p className="text-gray-400">
                        Discover experiences or host your own event.
                    </p>
                </div>
                <Button size="sm" onClick={handleOpenEventPopup}>
                    Create an event <Plus size={14}/>
                </Button>
            </div>

            <div className="inline-flex items-center gap-2 p-2 bg-border/40 border border-border rounded-lg my-4">
                {filters.map(({text , icon : Icon}) => 
                <button key={text} className={`flex items-center gap-1 px-4 py-2 hover:bg-border/60 transition duration-300 rounded-md cursor-pointer 
                                            ${filterType === text ? 'bg-border/60' : ''}`} 
                                            onClick={()=> setFilterType(text)}>
                    <Icon size={14}/>
                    <span className="text-xs">{text}</span>
                </button>)}
                
               
            </div>
            

            <div className="space-y-2">
                {events?.[filterType]?.length === 0 ? <div className='flex items-center justify-center flex-col gap-2 py-10 rounded-xl border-2 border-dashed border-border border-border'>
                        <Calendar size={48} className="mx-auto mb-4 text-gray-400"/>
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                            {filterType === 'myEvents' ? `You have not attended events yet` : `No ${filterType} events found`}
                        </h2>
                        <p className="text-gray-500 max-w-xl text-center"> 
                            It seems there are no events to show. Try changing the filter or create a new event.
                        </p>
                        <Button onClick={handleOpenEventPopup}>Create new event</Button>
                </div> : events?.[filterType]?.map(e => <EventCard event={e} key={e._id}/>)}
                
            </div>
        </div>
    </FeedLayout>
}

export default Events