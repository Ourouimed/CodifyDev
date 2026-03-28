import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema({
    content: { type: String, trim: true },
    images: { type: [String], default: [] },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    codeEditor: {
        code: { type: String, default: null },
        codeLanguage: { type: String, default: null }
    },
    poll: {
        options: [
            {
                optionText: { type: String, required: true },
                votes: [{ type: Schema.Types.ObjectId, ref: 'User' }]
            }
        ],
        expiresAt: { type: Date }
    },
    mentions: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

PostSchema.virtual('totalVotes').get(function() {
    if (!this.poll || !this.poll.options) return 0;
    return this.poll.options.reduce((acc, option) => acc + option.votes.length, 0);
});

PostSchema.set('toJSON', { virtuals: true });
PostSchema.set('toObject', { virtuals: true });


const Post = mongoose.model('Post', PostSchema);
export default Post;