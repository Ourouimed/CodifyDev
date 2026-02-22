import express from 'express'
import verifyJWT from '../middlewares/verifyJWT.js'
import { createPost, getAllPosts , getPostById , likePost} from '../controllers/postController.js'
const router = express.Router()


router.post('/create' , verifyJWT , createPost)
router.post('/like/:postId' , verifyJWT , likePost)
router.get('/' , verifyJWT , getAllPosts)
router.get('/post/:postId' , verifyJWT , getPostById)

export default router