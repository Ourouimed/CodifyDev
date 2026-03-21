import mongoose , { Schema} from 'mongoose';
const PostSchema = new Schema({
    content: { type: String, trim: true },
    images: { type: [String], default: [] },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    codeEditor : {
        code : {type : String , default : null} ,
        codeLanguage : {type : String , default : null}
    }
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);
export default Post;