import { useToast } from "@/hooks/useToast";
import { addReply, likeComment, toggleLikeComment } from "@/store/features/posts/postSlice";
import { formatDistanceToNowStrict } from "date-fns";
import { Heart, Loader2, MessageCircle, MoreHorizontal, SendHorizonal, User as UserIcon, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useDispatch } from "react-redux";
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from "../ui/Button";
import { usePosts } from "@/hooks/usePosts";

const CommentItem = ({ comment: c }) => {
  const [newComment, setNewComment] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false); 

  const { isLoading } = usePosts();
  const dispatch = useDispatch();
  const toast = useToast();
  
  const timeAgo = c.createdAt 
    ? formatDistanceToNowStrict(new Date(c.createdAt), { addSuffix: true })
    : "";

  const isDisabled = newComment.length <= 0 || newComment.length > 200 || isLoading;

  const handleAddReply = async () => {
    try {
      await dispatch(addReply({ commentId: c._id, reply: newComment })).unwrap();
      setNewComment('');
      setIsReplying(false); 
      setShowReplies(true); 
      toast.success('Reply published');
    } catch (err) {
      toast.error(err || "Error publishing comment");
    }
  };

  return (
    <div className="flex flex-col w-full" id={`comment-${c._id}`}>
      <div className="flex gap-3">
        <div className="flex flex-col items-center">
          <Link 
            href={`/profile/${c.author?.username}`}
            className="relative size-9 flex-shrink-0 rounded-full overflow-hidden bg-muted ring-1 ring-border/50 z-10"
          >
            {c.author?.avatar ? (
              <Image src={c.author.avatar} alt="User" fill className="object-cover" sizes="36px" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <UserIcon className="size-4" />
              </div>
            )}
          </Link>
          
          {c.replies?.length > 0 && showReplies && (
            <div className="w-[1.5px] h-full bg-border/60 mt-2 mb-[-14px]" />
          )}
        </div>

        <div className="flex flex-col flex-1 min-w-0 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-x-2">
              <Link href={`/profile/${c.author?.username}`} className="font-bold text-sm hover:underline truncate">
                {c.author?.displayName || "Anonymous"}
              </Link>
              <span className="text-[12px]">{timeAgo}</span>
            </div>
            <button className="p-1 rounded-full transition-colors">
              <MoreHorizontal className="size-4 text-muted-foreground/50" />
            </button>
          </div>

          <p className="text-[14.5px] text-foreground/90 mt-0.5 leading-relaxed">
            {c.content}
          </p>

          <div className="flex items-center gap-5 mt-2">
            <button onClick={() => dispatch(toggleLikeComment(c._id))} className="flex items-center gap-1.5 group cursor-pointer">
              <Heart className={`size-4 transition-colors ${c.isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground group-hover:text-red-500'}`} />
              <span className="text-xs text-muted-foreground">{c.likeCount || 0}</span>
            </button>

            <button 
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              <MessageCircle className="size-4" />
              <span className="text-xs">Reply</span>
            </button>

            {c.replies?.length > 0 && (
              <button 
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                {showReplies ? (
                  <> <ChevronUp className="size-3" /> Hide </>
                ) : (
                  <> <ChevronDown className="size-3" /> Show {c.replies.length} {c.replies.length === 1 ? 'reply' : 'replies'} </>
                )}
              </button>
            )}
          </div>

          {isReplying && (
            <div className="mt-4 p-3 border border-border rounded-xl bg-muted/20 animate-in fade-in slide-in-from-top-1">
                <TextareaAutosize
                    autoFocus
                    placeholder="Write your reply..."
                    className="w-full outline-none bg-transparent text-sm resize-none"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <div className='flex justify-end gap-2 mt-2'>
                    <Button variant="outline" className={isDisabled ? 'opacity-50' : 'opacity-100'} onClick={() => setIsReplying(false)}>Cancel</Button>
                    <Button variant='primary' className={isDisabled ? 'opacity-50' : 'opacity-100'} disabled={isDisabled} onClick={handleAddReply}>
                        {isLoading ? <Loader2 className="size-3 animate-spin"/> : 'Reply'}
                    </Button>
                </div>
            </div>
          )}
        </div>
      </div>

      {showReplies && c.replies?.length > 0 && (
        <div className="pl-6 md:pl-9 transition-all">
            {[...c.replies].reverse().map((r) => (
                <CommentItem key={r._id} comment={r} isReply={true} />
            ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;