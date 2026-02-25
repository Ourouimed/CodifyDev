import { usePopup } from "@/hooks/usePopup"
import { usePosts } from "@/hooks/usePosts"
import { useToast } from "@/hooks/useToast"
import { deletePost } from "@/store/features/posts/postSlice"
import { Loader2 } from "lucide-react"
import { useDispatch } from "react-redux"
import { Button } from "../ui/Button"

export default function DeletePost({ id }){
    const { closePopup } = usePopup()
    const toast = useToast()
    const { isLoading } = usePosts()
    const dispatch = useDispatch()

    const handleDeletePost = async () => {
        try {
            await dispatch(deletePost(id)).unwrap()
            toast.success("Post deleted successfully")
            closePopup()
        }
        catch (err) {
            toast.error(err || "Failed to delete post")
        }
    }
    return <>
        <p>Are you sure you want to delete this post ? <span className="text-semibold">{id}</span></p>
        <div className="flex justify-end items-center gap-2">
            <Button variant="outline" onClick={()=> closePopup()}>
                Cancel
            </Button>

            <Button onClick={handleDeletePost} disabled={isLoading} className={isLoading && 'opacity-50'}>
                {isLoading && <Loader2 className="animate-spin mr-2" />}
                {isLoading ? 'Deleting...' : 'Delete Post'}
            </Button>
        </div>
    </>
}