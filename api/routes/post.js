import express from 'express'
import verifyJWT from '../middlewares/verifyJWT.js'
import { createPost, getAllPosts } from '../controllers/postController.js'
const router = express.Router()


router.post('/create' , verifyJWT , createPost)
router.get('/' , verifyJWT , getAllPosts)

export default router