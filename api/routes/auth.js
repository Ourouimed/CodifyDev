import express from 'express'
import verifyJWT from '../middlewares/verifyJWT.js'
import { login, logout, register, verifySession } from '../controllers/authController.js'
const router = express.Router()

router.post('/register' , register)
router.post('/login' , login)
router.post('/logout' , logout)
router.get('/verify-session' , verifyJWT , verifySession)



export default router