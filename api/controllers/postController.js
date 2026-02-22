import Post from "../models/Post.js"

const createPost = async (req , res)=>{
    try {
        const userId = req.user.id
        const { content } = req.body

        if (!content){
            return res.status(400).json({error : 'Some required fields are missing!'})
        }


        const post = await Post.create({
            content , 
            author : userId
        })

        return res.json({message : 'Post created successfully' , post })
    }
    catch (err){
        console.log(err)
        return res.status(500).json({
            error : 'Internal server error'
        })
    }
}

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username avatar displayName') 
            .populate('comments.author', 'username')
            .sort({ createdAt: -1 }).
            lean();

        const processedPosts = posts.map(post => {
            return {
                ...post,
                isLiked: req.user?.id 
                    ? post.likes.some(id => id.toString() === req.user?.id.toString()) 
                    : false,
                likeCount: post.likes.length
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

export { createPost , getAllPosts}