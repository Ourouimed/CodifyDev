'use client'

import { useEffect, useState } from "react"
import FeedLayout from "../FeedLayout"
import { Button } from "@/components/ui/Button"
import { TextArea } from "@/components/ui/TextArea"
import { useDispatch } from "react-redux"
import { Link, Loader2, Paperclip, Vote } from "lucide-react"
import { useToast } from "@/hooks/useToast"
import { createPost, getAllPosts } from "@/store/features/posts/postSlice"
import { usePosts } from "@/hooks/usePosts"
import PostCard from "@/components/cards/PostCard"

const FeedHomePage = () => {
    const [feedType, setFeedType] = useState('Discover')
    const [content, setContent] = useState('')
    const { isLoading , posts} = usePosts()
    const dispatch = useDispatch()
    const toast = useToast()

    useEffect(()=>{
      if (feedType === 'Discover'){
        dispatch(getAllPosts())
      }
    } , [dispatch , feedType])

    const handlePostSubmit = async () => {
        if (!content.trim()) return
        try {
            await dispatch(createPost(content)).unwrap()
            toast.success('Post created successfully')
            setContent('')
        }
        catch (err){
            toast.error(err || 'Error')
        }
    } 




    return (
        <FeedLayout>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                    
                    
                    <div className="border border-border rounded-xl p-4 shadow-sm transition-all">
                        <TextArea 
                            placeholder="Share your thoughts..." 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                            {/* Action Icons */}
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <button className="hover:text-primary transition-colors">
                                    <Paperclip size={20} />
                                </button>
                                <button className="hover:text-primary transition-colors">
                                    <Link size={20} />
                                </button>
                                <button className="hover:text-primary transition-colors">
                                    <Vote size={20} />
                                </button>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className={`text-xs ${content.length > 250 && 'text-red-500'}`}>
                                    {content.length}/250
                                </span>
                                <Button 
                                    onClick={handlePostSubmit}
                                    disabled={!content.trim()}
                                    className={content.length === 0 ? 'opacity-70' : 'opacity-100'}
                                    variant="PRIMARY" 
                                >
                                    {isLoading && <Loader2 className={isLoading && 'animate-spin'}/>}
                                    {isLoading ? 'Posting...' : 'Post'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Feed Tabs with subtle underline style */}
                    <div className="flex items-center border-b border-border">
                        <button 
                            onClick={() => setFeedType('Discover')}
                            className={`px-4 py-3 text-sm font-medium transition-colors relative cursor-pointer  ${
                                feedType === 'Discover' && 'text-primary'
                            }`}
                        >
                            Discover
                            {feedType === 'Discover' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />}
                        </button>
                        <button 
                            onClick={() => setFeedType('Following')}
                            className={`px-4 py-3 text-sm font-medium transition-colors relative cursor-pointer ${
                                feedType === 'Following' && 'text-primary'
                            }`}
                        >
                            Following
                            {feedType === 'Following' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />}
                        </button>
                    </div>

                  
                    <div className="space-y-4">
                        {isLoading && posts.length === 0 ? (
                        <div className="flex justify-center p-10">
                            <Loader2 className="animate-spin text-primary" size={40} />
                        </div>
                        ) : posts.length > 0 ? (
                            posts.map((post) => <PostCard key={post._id} post={post} />)
                        ) : (
                            <div className="text-center p-10 text-muted-foreground">
                                No posts found in Discover. Be the first to post!
                            </div>
                        )}
                    </div>
                </div>

    
            </div>
        </FeedLayout>
    )
}

export default FeedHomePage