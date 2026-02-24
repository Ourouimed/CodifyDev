import { uploadImage } from "../lib/upload-image.js"
import Post from "../models/Post.js"
import User from "../models/User.js"
import Notification from "../models/Notification.js"

const createPost = async (req, res) => {
    try {
        const userId = req.user.id;
        const { content } = req.body;
        
        // 1. Get files from Multer
        const files = req.files || [];

        // 2. Validations
        if (!content && files.length === 0) {
            return res.status(400).json({ error: 'Post must have text or an image!' });
        }

        if (files.length > 10) {
            return res.status(400).json({ error: 'You can upload a maximum of 10 images' });
        }

        // Check file sizes
        for (const file of files) {
            if (file.size > 5 * 1024 * 1024) {
                return res.status(400).json({ error: `Image ${file.originalname} exceeds the 5MB size limit` });
            }
        }

        // 3. Upload Images and collect URLs
        const uploadPromises = files.map((file, index) => {
            const fileName = `post-images/${userId}/${Date.now()}-${index}.jpg`;
            return uploadImage(file.buffer, fileName);
        });

        const imageUrls = await Promise.all(uploadPromises);

        // 4. Create Post with the image URLs
        const post = await Post.create({
            content,
            author: userId,
            images: imageUrls 
        });



        return res.json({ 
            message: 'Post created successfully', 
            post 
        });

    } catch (err) {
        console.error("Create Post Error:", err);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username avatar displayName followers') 
            .populate('comments.author', 'username')
            .sort({ createdAt: -1 }).
            lean();

        const processedPosts = posts.map(post => {
            return {
                ...post,
                isLiked: req.user?.id 
                    ? post.likes.some(id => id.toString() === req.user?.id.toString()) 
                    : false,
                likeCount: post.likes.length , 
                isFollowing : req.user?.id ? post.author.followers.some(followerId => followerId.toString() === req.user.id.toString()) : false,
            };
        });
        return res.status(200).json({posts : processedPosts});
        
    } catch (err) {
        console.error("Error fetching posts:", err);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};

const getFollowingPosts = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('following').lean();
        const posts = await Post.find({ author: { $in: user.following } })
            .populate('author', 'username avatar displayName followers') 
            .populate('comments.author', 'username')
            .sort({ createdAt: -1 }).
            lean();
        const processedPosts = posts.map(post => {
            return {
                ...post,
                isLiked: req.user?.id 
                    ? post.likes.some(id => id.toString() === req.user?.id.toString()) 
                    : false,
                likeCount: post.likes.length , 
                isFollowing : req.user?.id ? post.author.followers.some(followerId => followerId.toString() === req.user.id.toString()) : false,
            };
        });
        return res.status(200).json({posts : processedPosts});
        
    } catch (err) {
        console.error("Error fetching posts:", err);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};


const getPostsByAuthor = async (req, res) => {
    try {
        const { username } = req.params
        const author = await User.findOne({username}).select('_id')
        const posts = await Post.find({ author: author._id })
            .populate('author', 'username avatar displayName followers') 
            .populate('comments.author', 'username')
            .sort({ createdAt: -1 }).
            lean();
        const processedPosts = posts.map(post => {
            return {
                ...post,
                isLiked: req.user?.id 
                    ? post.likes.some(id => id.toString() === req.user?.id.toString()) 
                    : false,
                likeCount: post.likes.length , 
                isFollowing : req.user?.id ? post.author.followers.some(followerId => followerId.toString() === req.user.id.toString()) : false,
            };
        });
        return res.status(200).json({posts : processedPosts});
        
    } catch (err) {
        console.error("Error fetching posts:", err);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};


const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId)
            .populate('author', 'username avatar displayName') 
            .populate('comments.author', 'username')
            .sort({ createdAt: -1 }).
            lean();

        const processedPost = {
            ...post,
            isLiked: req.user?.id 
                ? post.likes.some(id => id.toString() === req.user?.id.toString()) 
                    : false,
                likeCount: post.likes.length
            };  
    
        return res.json({post : processedPost});
        
    } catch (err) {
        console.error("Error fetching posts:", err);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};


const likePost = async (req, res) => {
    try {
        const { postId } = req.params
        const userId = req.user.id 


        const post = await Post.findById(postId)
        if (!post){
            return res.status(404).json({error : 'Post not found'})
        } 
        const isLiked = post.likes.some(id => id.toString() === userId.toString())
        if (isLiked){
            post.likes = post.likes.filter(id => id.toString() !== userId.toString())
            await Notification.findOneAndDelete({
                recipient : post.author , 
                sender : userId ,
                type : 'like' , 
                post : post._id
            });
        }
        else {
            post.likes.push(userId)
            if (post.author.toString() !== userId.toString()){
                await Notification.findOneAndDelete({
                    recipient : post.author , 
                    sender : userId ,
                    type : 'like' , 
                    post : post._id
                });
                await Notification.create({
                    recipient : post.author , 
                    sender : userId , 
                    type : 'like', 
                    post : post._id ,
                })
            }
        }
        await post.save()
        
        return res.json({message : 'Post liked/unliked successfully' , post})
    }
    catch (err) {
        console.error("Error liking post:", err);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }   
}


const deletePost = async (req, res) => {
    try {
        const { postId } = req.params
        const userId = req.user.id 
        const post = await Post.findById(postId)
        if (!post){
            return res.status(404).json({error : 'Post not found'})
        }
        if (post.author.toString() !== userId.toString()){
            return res.status(403).json({error : 'You are not authorized to delete this post'})
        }           
        await Post.findByIdAndDelete(postId)
        return res.json({message : 'Post deleted successfully'})
    }
    catch (err) {
        console.error("Error deleting post:", err);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
}
export { createPost , getAllPosts , getPostById , likePost , getFollowingPosts , getPostsByAuthor , deletePost}