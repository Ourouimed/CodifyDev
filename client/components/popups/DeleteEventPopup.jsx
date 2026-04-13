import { usePopup } from "@/hooks/usePopup"
import { useEvent } from "@/hooks/useEvent"
import { useToast } from "@/hooks/useToast"
import { Loader2 } from "lucide-react"
import { useDispatch } from "react-redux"
import { Button } from "../ui/Button"
import { deleteEvent } from "@/store/features/events/eventsSlice"
import { useRouter } from "next/navigation"

export default function DeleteEvent({ id , name}){
    const router = useRouter()
    const { closePopup } = usePopup()
    const toast = useToast()
    const { isLoading } = useEvent()
    const dispatch = useDispatch()

    const handleDeleteEvent = async () => {
        try {
            await dispatch(deleteEvent(id)).unwrap()
            toast.success("Event deleted successfully")
            closePopup() 
            router.push('/events')
        }
        catch (err) {
            toast.error(err || "Failed to delete post")
        }
    }
    return <>
        <p>Are you sure you want to delete <span className="font-bold">'{name}'</span> event ? </p>
        <div className="flex justify-end items-center gap-2">
            <Button variant="outline" onClick={()=> closePopup()}>
                Cancel
            </Button>

            <Button onClick={handleDeleteEvent} disabled={isLoading} className={isLoading && 'opacity-50'}>
                {isLoading && <Loader2 className="animate-spin mr-2" />}
                {isLoading ? 'Deleting...' : 'Delete Post'}
            </Button>
        </div>
    </>
}