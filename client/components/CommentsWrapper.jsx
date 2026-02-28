import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from './ui/Button';
import { Loader2, MessageCircle, SendHorizonal } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { useDispatch } from 'react-redux';
import { addComment } from '@/store/features/posts/postSlice';
import { usePosts } from '@/hooks/usePosts';
import CommentItem from './cards/CommentItem';
const CommentsWrapper = ({postId , comments})=>{
    const [newComment , setNewComment] = useState('')
    
    const toast = useToast() 
    const { isLoading } = usePosts() 
    const dispatch = useDispatch()
    const isDisabled = newComment.length <= 0 || newComment.length > 200 || isLoading



    const handleAddComment = async ()=>{
        try {
            dispatch(addComment({postId : postId , comment : newComment}))
            setNewComment('')
            toast.success('Comment published')
        }
        catch (err){
            toast.error(err || "Error publishing comment")
        }
    }
    return <div className='space-y-2'>
        <h3 className="font-semibold text-2xl">Comments ({comments.length})</h3>
        <div className="border border-border rounded-xl p-4 shadow-sm transition-all">
                        <TextareaAutosize
                            placeholder="Share your thoughts..."
                            minRows={1} 
                            maxRows={10} 
                            className="w-full outline-none resize-none bg-transparent text-foreground placeholder:text-muted-foreground"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <div className='flex justify-end items-center gap-3 '>
                                <span className={`text-xs font-mono ${newComment.length > 200 && 'text-red-500'}`}>
                                    {newComment.length}/200   
                                </span>
                                <Button variant='primary' className={`h-8 py-0 px-3 text-xs gap-1.5 ${isDisabled && 'opacity-50'}`}
                                    disabled={isDisabled} 
                                    onClick={handleAddComment}>
                                        {isLoading && <Loader2 className='animate-spin'/>}
                                        {isLoading ? 'Commenting...' : 'Comment'}
                                        <SendHorizonal className='size-4'/>
                                </Button>
                        </div>
        </div>

        {/* Comments List */}
            {comments.length === 0 ? (
                <div className='flex flex-col gap-3 items-center py-16 text-center bg-muted/30 rounded-3xl border border-dashed border-border'>
                    <div className="p-4 bg-background rounded-full shadow-sm">
                        <MessageCircle className='size-8' />
                    </div>
                    <div className="space-y-1">
                        <p className="font-semibold">No comments yet</p>
                        <p className="text-xs">Be the first to share your thoughts on this post.</p>
                    </div>
                </div>
            ) : (
                <div className='divide-y divide-border/60'>
                    {[...comments].reverse().map((c) => <CommentItem key={c._id} comment={c}/>)}
                </div>
            )}
    </div>
}

export default CommentsWrapper