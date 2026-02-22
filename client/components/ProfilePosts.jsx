import { usePosts } from "@/hooks/usePosts"
import { getPostsByAuthor } from "@/store/features/posts/postSlice"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import PostCard from "./cards/PostCard"

const ProfilePosts = ({username})=>{
    const { posts , isLoading} = usePosts() 
    const dispatch = useDispatch()
    useEffect( ()=>{
        dispatch(getPostsByAuthor(username))
    }, [dispatch])
    return <div className="space-y-3">
        {isLoading ? (
            <p>Loading posts...</p>
        ) : (
            posts.length > 0 ? (
                posts.map((post) => <PostCard key={post._id} post={post} />)
            ) : (
                <p>No posts found.</p>
            )
        )}
                    
    </div>
}


export default ProfilePosts