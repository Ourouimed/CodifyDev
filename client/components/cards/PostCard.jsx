'use client'

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { formatDistanceToNowStrict } from "date-fns";
import { EllipsisVertical, Heart, UserPlus, MessageCircle, Share } from "lucide-react";
import { Button } from "../ui/Button";
import { useToast } from "@/hooks/useToast";
import { likePost, toggleLikePost } from "@/store/features/posts/postSlice";

const PostCard = ({ post }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const dispatch = useDispatch();
    const toast = useToast();

    // Configuration
    const CHAR_LIMIT = 200;
    const isLongPost = post.content.length > CHAR_LIMIT;
    
    // Formatting Date
    const timeAgo = formatDistanceToNowStrict(new Date(post.createdAt), {
        addSuffix: true,
    });

    // Content Display Logic
    const displayedContent = isExpanded 
        ? post.content 
        : post.content.slice(0, CHAR_LIMIT);

    const handleLike = async () => {
        try {
            // 1. Optimistic Update (Immediate UI change)
            dispatch(toggleLikePost(post._id));
            
            // 2. Server Sync
            await dispatch(likePost(post._id)).unwrap();
        } catch (err) {
            toast.error('Failed to update like');
        }
    };

    const handleShare = () => {
        const postUrl = `${window.location.origin}/feed/post/${post._id}`;
        navigator.clipboard.writeText(postUrl)
            .then(() => toast.success('Link copied to clipboard'))
            .catch(() => toast.error('Failed to copy link'));
    };

    return (
        <div className="p-4 rounded-xl border border-border space-y-3 bg-card transition-all hover:shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="relative w-10 h-10 overflow-hidden rounded-full bg-muted border border-border flex-shrink-0">
                        <Image
                            src={post.author?.avatar || "/default-avatar.png"} 
                            alt={`${post.author?.username}'s avatar`}
                            fill
                            sizes="40px"
                            className="object-cover"
                        />                 
                    </div>
                    <div className="flex flex-col">
                        <Link href={`/profile/${post.author?.username}`}>
                            <h3 className="font-bold text-sm leading-tight hover:underline">
                                {post.author?.displayName || post.author?.username}
                            </h3>
                        </Link>
                        <span className="text-xs text-muted-foreground">
                            @{post.author?.username} · {timeAgo}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <Button variant='outline' className="h-8 py-0 px-3 text-xs gap-1.5">
                        Follow
                        <UserPlus className="w-3.5 h-3.5"/>
                    </Button>
                    <button className="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground">
                        <EllipsisVertical className="w-4 h-4"/>
                    </button>
                </div>
            </div>

            <div className="text-[15px] leading-relaxed break-words">
                {displayedContent}
                {isLongPost && !isExpanded && "..."}
                
                {isLongPost && (
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="ml-1 text-primary hover:underline font-semibold text-sm cursor-pointer"
                    >
                        {isExpanded ? "Show less" : "Show more"}
                    </button>
                )}
            </div>

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
                                    : 'text-muted-foreground group-hover:text-red-500'
                            }`} 
                        />
                        <span className={`text-sm transition-colors ${
                            post.isLiked ? 'text-red-500 font-bold' : 'text-muted-foreground'
                        }`}>
                            {post.likeCount || 0}
                        </span>
                    </button>

                    <Link href={`/feed/post/${post._id}`}>
                        <button className="flex items-center gap-1.5 group cursor-pointer text-muted-foreground hover:text-primary transition-colors">
                            <MessageCircle className="w-[18px] h-[18px]" />
                            <span className="text-sm">{post.comments?.length || 0}</span>
                        </button>
                    </Link>
                </div>
                <button 
                    onClick={handleShare}
                    className="cursor-pointer p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-all"
                >
                    <Share className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default PostCard;