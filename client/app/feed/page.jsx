'use client'
import { useEffect, useState } from "react"
import FeedLayout from "../FeedLayout"
import { useDispatch } from "react-redux"
import { Loader2, Compass, Users, Sparkles } from "lucide-react" 
import { getAllPosts, getFollowingPosts } from "@/store/features/posts/postSlice"
import { usePosts } from "@/hooks/usePosts"
import PostCard from "@/components/cards/PostCard"
import CreatePostArea from "@/components/CreatePostArea";

const FeedHomePage = () => {
    const [feedType, setFeedType] = useState('Discover')
    const { isLoading, posts } = usePosts()
    const dispatch = useDispatch()

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        if (feedType === 'Discover') {
            dispatch(getAllPosts())
        } else {
            dispatch(getFollowingPosts())
        }
    }, [dispatch, feedType])

    return (
        <FeedLayout>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 md:col-span-2 space-y-6">
                    
                    {/* Navigation Tabs */}
                    <div className="sticky top-14 bg-background z-20 flex items-center gap-2 border-b border-border pt-1">
                        {[
                            { id: 'Discover', label: 'For You', icon: Compass },
                            { id: 'Following', label: 'Following', icon: Users }
                        ].map((tab) => {
                            const Icon = tab.icon;
                            const isActive = feedType === tab.id;
                            return (
                                <button 
                                    key={tab.id}
                                    onClick={() => setFeedType(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all relative cursor-pointer group ${
                                        isActive && 'text-primary'
                                    }`}
                                >
                                    <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                    {tab.label}
                                    {isActive && (
                                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-in fade-in zoom-in duration-300" />
                                    )}
                                </button>
                            )
                        })}
                    </div>

                    {/* Create Post Area */}
                    <CreatePostArea />

                    {/* Posts List */}
                    <div className="space-y-4">
                        {isLoading && posts.length === 0 ? (
                            // Loading Skeleton State
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-full h-64 bg-muted animate-pulse rounded-xl border border-border" />
                                ))}
                                <div className="flex flex-col items-center justify-center p-10 gap-3">
                                    <Loader2 className="animate-spin text-primary/50" size={32} />
                                    <p className="text-sm text-muted-foreground">Curating your feed...</p>
                                </div>
                            </div>
                        ) : posts.length > 0 ? (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
                                {posts.map((post) => (
                                    <PostCard key={post._id} post={post} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center p-16 space-y-4 bg-card/50 rounded-2xl border border-dashed border-border transition-all">
                                <div className="p-4 bg-primary/10 rounded-full">
                                    <Sparkles className="w-8 h-8 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold">Nothing to see in {feedType}</h3>
                                    <p className="text-muted-foreground max-w-[250px] mx-auto text-sm">
                                        {feedType === 'Discover' 
                                            ? "Looks like the world is quiet today. Why not start the conversation?"
                                            : "Follow some developers to see what they're building!"}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="hidden md:block col-span-1">
                    <div className="sticky top-20 space-y-6">
                        <div className="p-5 rounded-2xl border border-border">
                            <h4 className="font-bold mb-3">Who to follow</h4>
                            <p className="text-xs text-muted-foreground">Suggestions will appear here based on your tech stack.</p>
                        </div>
                    </div>
                </div>
            </div>
        </FeedLayout>
    )
}

export default FeedHomePage