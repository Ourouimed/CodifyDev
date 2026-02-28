import mongoose , { Schema} from 'mongoose';
const PostSchema = new Schema({
    content: { type: String, required: true, trim: true },
    images: { type: [String], default: [] },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);
export default Post;