import express from 'express'
import verifyJWT from '../middlewares/verifyJWT.js'
import multer from 'multer'
import { createPost, getAllPosts , getPostById , likePost , getFollowingPosts, getPostsByAuthor} from '../controllers/postController.js'
const router = express.Router()


const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/create' , verifyJWT , upload.array('post-images', 10) , createPost)
router.post('/like/:postId' , verifyJWT , likePost)
router.get('/' , verifyJWT , getAllPosts)
router.get('/following' , verifyJWT , getFollowingPosts)
router.get('/post/:postId' , verifyJWT , getPostById)
router.get('/author/:username' , verifyJWT , getPostsByAuthor)

export default router