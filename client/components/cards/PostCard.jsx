'use client'

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { formatDistanceToNowStrict } from "date-fns";
import { 
    EllipsisVertical, Heart, UserPlus, MessageCircle, 
    Share, UserCheck, ChevronLeft, ChevronRight, 
    Trash2, Bookmark, Link as LinkIcon, Flag, VolumeX
} from "lucide-react";
import { Button } from "../ui/Button";
import { useToast } from "@/hooks/useToast";
import { likePost, toggleLikePost, updateFollowStatus } from "@/store/features/posts/postSlice";
import { followUnfollow } from "@/services/followUnfollow";
import { useAuth } from "@/hooks/useAuth";
import { usePopup } from "@/hooks/usePopup";

const PostCard = ({ post, isExpandedText }) => { 
    const [isExpanded, setIsExpanded] = useState(isExpandedText || false);
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef(null);
    const dispatch = useDispatch();
    const toast = useToast();
    const { user } = useAuth();

    // ACTIONS DROP DOWN
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Popup
    const { openPopup } = usePopup()

    // Configuration
    const CHAR_LIMIT = 200;
    const isLongPost = post.content?.length > CHAR_LIMIT;
    const timeAgo = formatDistanceToNowStrict(new Date(post.createdAt), { addSuffix: true });

    // Content Display Logic
    const displayedContent = isExpanded 
        ? post.content 
        : post.content?.slice(0, CHAR_LIMIT);

    // Carousel Scroll Logic
    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const index = Math.round(scrollLeft / clientWidth);
            setActiveIndex(index);
        }
    };

    const scrollToIndex = (index) => {
        if (scrollRef.current) {
            const clientWidth = scrollRef.current.clientWidth;
            scrollRef.current.scrollTo({
                left: index * clientWidth,
                behavior: 'smooth'
            });
        }
    };

    const handleLike = async () => {
        try {
            dispatch(toggleLikePost(post._id));
            await dispatch(likePost(post._id)).unwrap();
        } catch (err) {
            toast.error('Failed to update like');
        }
    };

    const handleShare = () => {
        const postUrl = `${window.location.origin}/feed/post/${post._id}`;
        navigator.clipboard.writeText(postUrl)
            .then(() => {
                toast.success('Link copied to clipboard');
                setIsOpen(false);
            })
            .catch(() => toast.error('Failed to copy link'));
    };

    const handleFollowUnfollow = async (username) => {
        try {
            const response = await followUnfollow(username);
            dispatch(updateFollowStatus({ username, isFollowing: response.profile.isFollowing }));
            toast.success("Follow status updated");
        } catch (error) {
            toast.error(error || "Failed to update follow status");
        }
    };


    const renderSlideshow = () => {
        const images = post.images || [];
        if (images.length === 0) return null;

        return (
            <div className="relative group mt-3">
                <div 
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-xl border border-border bg-black aspect-square relative"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {images.map((img, index) => (
                        <div key={index} className="flex-shrink-0 w-full snap-center snap-always relative">
                            <Image
                                src={img}
                                alt={`Post image ${index + 1}`}
                                fill
                                className="object-cover"
                                priority={index === 0}
                            />
                        </div>
                    ))}
                </div>

                {images.length > 1 && (
                    <>
                        {activeIndex > 0 && (
                            <button 
                                onClick={() => scrollToIndex(activeIndex - 1)}
                                className="cursor-pointer absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ChevronLeft size={20} />
                            </button>
                        )}
                        {activeIndex < images.length - 1 && (
                            <button 
                                onClick={() => scrollToIndex(activeIndex + 1)}
                                className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ChevronRight size={20} />
                            </button>
                        )}
                    </>
                )}

                {images.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                        {activeIndex + 1}/{images.length}
                    </div>
                )}

                {images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 px-2 py-1 bg-black/20 backdrop-blur-md rounded-full">
                        {images.map((_, index) => (
                            <div 
                                key={index}
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                    index === activeIndex ? "bg-white" : "bg-white/40"
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };


    const handleOpenDeletePopup = () => {
        openPopup({
            title: "Delete Post", 
            component : 'DeletePost',
            props: { id: post._id } ,
        })
        setIsOpen(false);
    }

    return (
        <div className="p-4 rounded-xl border border-border space-y-3 bg-card transition-all hover:shadow-sm">
            {/* Header Section */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="relative w-10 h-10 overflow-hidden rounded-full border border-border flex-shrink-0">
                        {post.author?.avatar ? (
                            <Image
                                src={post.author?.avatar} 
                                alt="avatar"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-secondary flex items-center justify-center font-bold">
                                {post.author?.displayName?.charAt(0).toUpperCase() || "?"}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <Link href={`/profile/${post.author?.username}`}>
                            <h3 className="font-bold text-sm leading-tight hover:underline">
                                {post.author?.displayName || post.author?.username}
                            </h3>
                        </Link>
                        <span className="text-xs">
                            @{post.author?.username} · {timeAgo}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {post.author?.username !== user?.username && (
                        <Button 
                            variant='outline' 
                            className="h-8 py-0 px-3 text-xs gap-1.5" 
                            onClick={() => handleFollowUnfollow(post.author?.username)}
                        >
                            {post.isFollowing ? 'Unfollow' : 'Follow'}
                            {post.isFollowing ? <UserCheck className="w-3.5 h-3.5"/> : <UserPlus className="w-3.5 h-3.5"/>}
                        </Button>
                    )}
                    <div className="relative" ref={dropdownRef}>
                        <button className="cursor-pointer p-2 hover:text-primary 
                                        hover:bg-primary/10 rounded-full transition-all" 
                                        onClick={()=> setIsOpen(!isOpen)}>
                            <EllipsisVertical className="w-4 h-4"/>
                        </button>
                        {isOpen && (
                            <div className="z-50 min-w-56 absolute right-0 mt-2 bg-background border border-border rounded-xl shadow-xl animate-in fade-in zoom-in duration-200 divide-y divide-border overflow-hidden">
                                <div className="p-1.5">
                                    <button 
                                        className='cursor-pointer w-full flex items-center gap-2 text-sm hover:bg-secondary py-2 px-3 rounded-md transition-colors' 
                                    >
                                        <Bookmark size={16}/>
                                        Save Post
                                    </button>
                                    <button 
                                        className='cursor-pointer w-full flex items-center gap-2 text-sm hover:bg-secondary py-2 px-3 rounded-md transition-colors' 
                                        onClick={handleShare}
                                    >
                                        <LinkIcon size={16}/>
                                        Copy Link
                                    </button>
                                </div>
                                
                                <div className="p-1.5">
                                    {post.author?.username !== user?.username && (
                                        <>
                                            <button 
                                                className='cursor-pointer w-full flex items-center gap-2 text-sm text-destructive hover:bg-red-500/10 py-2 px-3 rounded-md transition-colors' 
                                            >
                                                <Flag size={16}/>
                                                Report Post
                                            </button>
                                        </>
                                    )}

                                    {post.author?.username === user?.username && (
                                        <button 
                                            className='cursor-pointer w-full flex items-center gap-2 text-sm text-destructive hover:bg-red-500/10 py-2 px-3 rounded-md transition-colors' 
                                            onClick={handleOpenDeletePopup}
                                        >
                                            <Trash2 size={16}/>
                                            Delete Post
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Text Section */}
            <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                {displayedContent}
                {isLongPost && !isExpanded && (
                    <span 
                        className="text-primary hover:underline font-semibold cursor-pointer ml-1 text-xs" 
                        onClick={() => setIsExpanded(true)}
                    >
                        ...show more
                    </span>
                )}
                {isExpanded && isLongPost && !isExpandedText && (
                    <span 
                        className="text-primary hover:underline font-semibold cursor-pointer ml-1 text-xs" 
                        onClick={() => setIsExpanded(false)}
                    >
                        show less
                    </span>
                )}
            </div>

            {/* Slideshow Content */}
            {renderSlideshow()}

            {/* Action Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={handleLike} 
                        className="flex items-center gap-1.5 group cursor-pointer transition-colors"
                    >
                        <Heart 
                            className={`w-[18px] h-[18px] transition-all duration-300 ${
                                post.isLiked 
                                    ? 'fill-red-500 text-red-500 scale-110' 
                                    : 'group-hover:text-red-500'
                            }`} 
                        />
                        <span className={`text-sm transition-colors ${
                            post.isLiked ? 'text-red-500 font-bold' : 'text-muted-foreground'
                        }`}>
                            {post.likeCount || 0}
                        </span>
                    </button>

                    <Link href={`/feed/post/${post._id}#comments`}>
                        <button className="flex items-center gap-1.5 group cursor-pointer text-muted-foreground hover:text-primary transition-colors">
                            <MessageCircle className="w-[18px] h-[18px]" />
                            <span className="text-sm">{post.comments?.length || 0}</span>
                        </button>
                    </Link>
                </div>
                <button 
                    onClick={handleShare}
                    className="cursor-pointer p-2 hover:text-primary hover:bg-primary/10 rounded-full transition-all"
                >
                    <Share className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default PostCard;