import mongoose from 'mongoose';
const { Schema } = mongoose;

const CommentSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

CommentSchema.add({
    replies: [CommentSchema]
});

const PostSchema = new Schema({
    content: { 
        type: String, 
        required: true, 
        trim: true 
    },
    images: {
        type: [String],
        default: []
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [CommentSchema] 
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

export default Post