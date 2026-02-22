import mongoose, { Schema } from "mongoose";

const PostSchema = new mongoose.Schema({
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
    likes : {
        type: [{type : Schema.Types.ObjectId , ref : 'User'}],
        default: []
    },
    comments: [
        {
            author: { type: Schema.Types.ObjectId, ref: 'User' , required : true},
            content: {type : String , required : true},
            createdAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

export default Post;