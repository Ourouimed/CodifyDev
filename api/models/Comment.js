import mongoose , { Schema} from 'mongoose';

const CommentSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true }, // Added this!
    content: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    parentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null } 
}, { timestamps: true });

const Comment = mongoose.model('Comment', CommentSchema);
export default Comment