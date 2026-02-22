'use client'
import { useEffect } from "react"
import { useParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { getSinglePost } from "@/store/features/posts/postSlice"
import FeedLayout from "@/app/FeedLayout"
import PostCard from "@/components/cards/PostCard"
import { Loader2 } from "lucide-react"

const PostPage = () => {
    const { postId } = useParams()
    const dispatch = useDispatch()
    
    const post = useSelector((state) => 
        state.post.posts.find((p) => p._id === postId)
    )
    const { isLoading } = useSelector((state) => state.post)

    useEffect(() => {
        dispatch(getSinglePost(postId))
    }, [postId, dispatch])

    return (
        <FeedLayout>
                {isLoading && !post ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="animate-spin h-8 w-8 text-primary"/>
                    </div>
                ) : post ? (
                    <PostCard post={post} />
                ) : (
                    <div className="text-center py-10 text-muted-foreground">
                        Post not found.
                    </div>
                )}
        </FeedLayout>
    )
}

export default PostPage