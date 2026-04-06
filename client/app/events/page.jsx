'use client'
import { Button } from "@/components/ui/Button"
import FeedLayout from "../FeedLayout"
import { Plus } from "lucide-react"
import { usePopup } from "@/hooks/usePopup"

const Events = ()=>{
    const { openPopup } = usePopup()

    const handleOpenEventPopup = ()=>{
        openPopup({title : 'Create event' , component : 'CreateEventPopup'})
    }
    return <FeedLayout>
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">
                    Events
                </h1> 
                <Button size="sm" onClick={handleOpenEventPopup}>
                    Create an event <Plus size={14}/>
                </Button>
            </div>
            
        </div>
    </FeedLayout>
}

export default Events