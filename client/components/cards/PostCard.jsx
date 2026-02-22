import Image from "next/image";
import { Button } from "../ui/Button";
import { EllipsisVertical, Heart, UserPlus, MessageCircle } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";

const PostCard = ({ post }) => {
    const timeAgo = formatDistanceToNowStrict(new Date(post.createdAt), {
        addSuffix: true,
    });

    return (
        <div className="p-4 rounded-xl border border-border space-y-3 bg-card transition-all hover:shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="relative w-10 h-10 overflow-hidden rounded-full bg-muted border border-border">
                        <Image
                            src={post.author?.avatar || "/default-avatar.png"} 
                            alt={`${post.author?.username}'s avatar`}
                            fill
                            sizes="40px"
                            className="object-cover"
                        />                 
                    </div>
                    <div>
                        <h3 className="font-bold text-sm leading-tight">
                            {post.author?.displayName || post.author?.username}
                        </h3>
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
                    <button className="p-1 hover:bg-muted rounded-full">
                        <EllipsisVertical className="w-4 h-4 text-muted-foreground"/>
                    </button>
                </div>
            </div>

            <div className="text-[15px] leading-relaxed">
                {post.content}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-6">
                    <button className="transition duration-300 flex items-center gap-1.5 group cursor-pointer hover:text-red-500">
                        <Heart 
                            className={`w-4.5 h-4.5 transition duration-300 ${
                                post.isLiked 
                                && 'fill-red-500 text-red-500' 
            
                            }`} 
                        />
                        <span className={`text-sm  transition duration-300 ${post.isLiked && 'text-red-500 font-medium'}`}>
                            {post.likeCount || 0}
                        </span>
                    </button>

                  
                    <button className=" transition duration-300 flex items-center gap-1.5 group cursor-pointer hover:text-primary">
                        <MessageCircle className="w-4.5 h-4.5" />
                        <span className="text-sm  transition duration-300">{post.comments?.length || 0}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PostCard;