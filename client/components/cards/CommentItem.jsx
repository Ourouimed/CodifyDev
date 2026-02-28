import { useToast } from "@/hooks/useToast";
import { likeComment, toggleLikeComment } from "@/store/features/posts/postSlice";
import { formatDistanceToNowStrict } from "date-fns";
import { Heart, MessageCircle, MoreHorizontal, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";

const CommentItem = ({ comment: c }) => {
  const timeAgo = formatDistanceToNowStrict(new Date(c.createdAt), {
    addSuffix: true,
  });
  const dispatch = useDispatch()
  const toast = useToast()


  const handleLike = async () => {
        try {
            dispatch(toggleLikeComment(c._id));
            await dispatch(likeComment(c._id)).unwrap();
        } catch (err) {
            toast.error('Failed to update like');
        }
    };


  return (
    <div className="group flex flex-col gap-3 py-4 transition-all" id={`comment-${c._id}`}>
      <div className="flex gap-3">
        <div className="flex flex-col items-center">
          <Link 
            href={`/profile/${c.author?.username}`}
            className="relative size-10 flex-shrink-0 rounded-full overflow-hidden bg-muted ring-1 ring-border/50 hover:opacity-90 transition-opacity"
          >
            {c.author?.avatar ? (
              <Image
                src={c.author.avatar}
                alt={c.author.displayName || "User"}
                fill
                className="object-cover"
                sizes="40px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="size-5 text-muted-foreground/60" />
              </div>
            )}
          </Link>
          <div className="w-px h-full bg-border/40 my-1 group-last:hidden" />
          
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-baseline gap-x-2 overflow-hidden">
              <Link
                href={`/profile/${c.author?.username}`}
                className="font-bold text-[14px] text-foreground hover:underline truncate"
              >
                {c.author?.displayName || "Anonymous"}
              </Link>
              <span className="text-xs text-muted-foreground font-medium truncate">
                @{c.author?.username}
              </span>
              <span className="text-muted-foreground/30 text-[10px]">•</span>
              <span className="text-[12px] text-muted-foreground/70 whitespace-nowrap">
                {timeAgo}
              </span>
            </div>
            
            <button className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted rounded-full cursor-pointer">
              <MoreHorizontal className="size-4 text-muted-foreground" />
            </button>
          </div>

          <p className="text-[14.5px] text-foreground/90 leading-relaxed break-words whitespace-pre-wrap mt-0.5">
            {c.content}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-5 mt-3">
            <button 
                        onClick={handleLike} 
                        className="flex items-center gap-1.5 group cursor-pointer transition-colors"
                    >
                        <Heart 
                            className={`w-[18px] h-[18px] transition-all duration-300 ${
                                c.isLiked 
                                    ? 'fill-red-500 text-red-500 scale-110' 
                                    : 'group-hover:text-red-500'
                            }`} 
                        />
                        <span className={`text-sm transition-colors ${
                            c.isLiked ? 'text-red-500 font-bold' : 'text-muted-foreground'
                        }`}>
                            {c.likeCount || 0}
                        </span>
                    </button>

                    
                        <button className="flex items-center gap-1.5 group cursor-pointer text-muted-foreground hover:text-primary transition-colors">
                            <MessageCircle className="w-[18px] h-[18px]" />
                            <span className="text-sm">{c.comments?.length || 0}</span>
                        </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;