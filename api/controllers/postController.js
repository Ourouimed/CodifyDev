import { uploadImage } from "../lib/upload-image.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js"; 
import Notification from "../models/Notification.js";

// --- HELPERS ---
const buildCommentTree = (allComments, userId, pId = null) => {
    return allComments
        .filter(c => {
            const commentParentId = c.parentId ? c.parentId.toString() : null;
            const targetParentId = pId ? pId.toString() : null;
            return commentParentId === targetParentId;
        })
        .map(c => ({
            ...c,
            likeCount: c.likes?.length || 0,
            isLiked: userId ? c.likes?.some(id => id.toString() === userId.toString()) : false,
            // RECURSION: Find all replies where this comment is the parent
            replies: buildCommentTree(allComments, userId, c._id)
        }));
};

const processedPost = (post, allComments, userId) => {
    if (!post) return null;
    const commentTree = buildCommentTree(allComments || [], userId);
    
    return {
        ...post,
        isLiked: userId ? post.likes?.some(id => id.toString() === userId.toString()) : false,
        isFollowing: userId && post.author?.followers 
            ? post.author.followers.some(id => id.toString() === userId.toString()) 
            : false,
        likeCount: post.likes?.length || 0,
        commentCount: post.commentCount || 0, 
        comments: commentTree
    };
};

// --- CONTROLLERS ---
const createPost = async (req, res) => {
    try {
        const userId = req.user.id;
        const { content } = req.body;
        const files = req.files || [];

        if (!content && files.length === 0) {
            return res.status(400).json({ error: 'Post must have text or an image!' });
        }

        const uploadPromises = files.map((file, index) => {
            const fileName = `post-images/${userId}/${Date.now()}-${index}.jpg`;
            return uploadImage(file.buffer, fileName);
        });

        const imageUrls = await Promise.all(uploadPromises);

        const post = await Post.create({
            content,
            author: userId,
            images: imageUrls 
        });

        const populated = await Post.findById(post._id).populate('author', 'username avatar displayName').lean();
        return res.json({ 
            message: 'Post created successfully', 
            post: processedPost(populated, [], userId) 
        });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const userId = req.user?.id;
        const posts = await Post.find()
            .populate('author', 'username avatar displayName followers') 
            .sort({ createdAt: -1 })
            .lean();
        console.log(posts)

        const postIds = posts.map(p => p._id);
        const allComments = await Comment.find({ postId: { $in: postIds } })
            .populate('author', 'username avatar displayName')
            .lean();

        const processedPosts = posts.map(post => {
            const postComments = allComments.filter(c => c.postId.toString() === post._id.toString());
            return processedPost(post, postComments, userId);
        });
        return res.status(200).json({ posts: processedPosts });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId)
            .populate('author', 'username avatar displayName followers') 
            .lean();

        if (!post) return res.status(404).json({ error: 'Post not found' });

        const allComments = await Comment.find({ postId })
            .populate('author', 'username avatar displayName')
            .sort({ createdAt: 1 })
            .lean();

        return res.json({ post: processedPost(post, allComments, req.user?.id) });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const isLiked = post.likes.some(id => id.toString() === userId);

        if (isLiked) {
            post.likes.pull(userId);
            await Notification.findOneAndDelete({ recipient: post.author, sender: userId, type: 'like', post: post._id });
        } else {
            post.likes.push(userId);
            if (post.author.toString() !== userId) {
                await Notification.create({ recipient: post.author, sender: userId, type: 'like', post: post._id });
            }
        }
        await post.save();

        const updated = await Post.findById(postId).populate('author', 'username avatar displayName followers').lean();
        const allComments = await Comment.find({ postId }).populate('author', 'username avatar displayName').lean();

        return res.json({ message: 'Success', post: processedPost(updated, allComments, userId) });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        const newComment = await Comment.create({
            author: userId,
            postId,
            content,
            parentId: null
        });

        console.log(newComment)

        const post = await Post.findByIdAndUpdate(
            postId,
            { $inc: { commentCount: 1 } },
            { new: true }
        ).populate('author', 'username avatar displayName followers').lean();

        if (post.author.toString() !== userId) {
            await Notification.create({
                recipient: post.author,
                sender: userId,
                type: 'comment',
                message: content,
                post: post._id,
                comment: newComment._id
            });
        }

        const allComments = await Comment.find({ postId }).populate('author', 'username avatar displayName').lean();
        return res.json({ post: processedPost(post, allComments, userId) });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const addReply = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { reply } = req.body;
        const userId = req.user.id;

        const parentComment = await Comment.findById(commentId);
        if (!parentComment) return res.status(404).json({ error: 'Parent comment not found' });

        const newReply = await Comment.create({
            author: userId,
            postId: parentComment.postId,
            content: reply,
            parentId: commentId
        });

        const post = await Post.findByIdAndUpdate(
            parentComment.postId,
            { $inc: { commentCount: 1 } },
            { new: true }
        ).populate('author', 'username avatar displayName followers').lean();

        if (parentComment.author.toString() !== userId) {
            await Notification.create({
                recipient: parentComment.author,
                sender: userId,
                type: 'reply',
                message: reply,
                comment: commentId,
                post: post._id,
            });
        }

        const allComments = await Comment.find({ postId: post._id }).populate('author', 'username avatar displayName').lean();
        return res.json({ post: processedPost(post, allComments, userId) });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const likeComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;

        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });

        const isLiked = comment.likes.includes(userId);

        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            isLiked ? { $pull: { likes: userId } } : { $addToSet: { likes: userId } },
            { new: true }
        );

        if (isLiked) {
            await Notification.findOneAndDelete({ sender: userId, comment: commentId, type: 'comment_like' });
        } else if (comment.author.toString() !== userId) {
            await Notification.create({
                recipient: comment.author,
                sender: userId,
                type: 'comment_like',
                post: comment.postId,
                comment: commentId
            });
        }

        const post = await Post.findById(comment.postId).populate('author', 'username avatar displayName followers').lean();
        const allComments = await Comment.find({ postId: comment.postId }).populate('author', 'username avatar displayName').lean();

        return res.json({ post: processedPost(post, allComments, userId) });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        if (post.author.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

        await Post.findByIdAndDelete(postId);
        await Comment.deleteMany({ postId }); 
        return res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('following').lean();
        const posts = await Post.find({ author: { $in: user.following } })
            .populate('author', 'username avatar displayName followers') 
            .sort({ createdAt: -1 }).lean();

        const postIds = posts.map(p => p._id);
        const allComments = await Comment.find({ postId: { $in: postIds } }).populate('author', 'username avatar displayName').lean();

        return res.json({ posts: posts.map(p => {
            const postComments = allComments.filter(c => c.postId.toString() === p._id.toString());
            return processedPost(p, postComments, userId);
        })});
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getPostsByAuthor = async (req, res) => {
    try {
        const userId = req.user?.id;
        const author = await User.findOne({ username: req.params.username }).select('_id');
        if (!author) return res.status(404).json({ error: 'User not found' });

        const posts = await Post.find({ author: author._id })
            .populate('author', 'username avatar displayName followers') 
            .sort({ createdAt: -1 }).lean();

        const postIds = posts.map(p => p._id);
        const allComments = await Comment.find({ postId: { $in: postIds } }).populate('author', 'username avatar displayName').lean();

        return res.json({ posts: posts.map(p => {
            const postComments = allComments.filter(c => c.postId.toString() === p._id.toString());
            return processedPost(p, postComments, userId);
        })});
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export { 
    createPost, getAllPosts, getPostById, likeComment, addReply, 
    likePost, getFollowingPosts, getPostsByAuthor, addComment, deletePost 
};