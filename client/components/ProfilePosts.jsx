import { usePosts } from "@/hooks/usePosts"
import { getPostsByAuthor } from "@/store/features/posts/postSlice"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import PostCard from "./cards/PostCard"
import { Loader2 } from "lucide-react"

const ProfilePosts = ({username})=>{
    const { posts , isLoading} = usePosts() 
    const dispatch = useDispatch()
    useEffect( ()=>{
        dispatch(getPostsByAuthor(username))
    }, [dispatch])
    return<div className="space-y-4">
                        {isLoading && posts.length === 0 ? (
                            <div className="flex justify-center p-10">
                                <Loader2 className="animate-spin text-primary" size={40} />
                            </div>
                        ) : posts.length > 0 ? (
                            posts.map((post) => <PostCard key={post._id} post={post} />)
                        ) : (
                            <div className="text-center p-10 text-muted-foreground bg-card rounded-xl border border-dashed border-border">
                                No posts found
                            </div>
                        )}
                    </div>
}


export default ProfilePosts