import express from 'express'
import verifyJWT from '../middlewares/verifyJWT.js'
import passport from 'passport';
import { authCallback, login, logout, register, verifySession } from '../controllers/authController.js'
import { config } from 'dotenv';
const router = express.Router()

config()
const JWT_SECRET = process.env.JWT_SECRET

router.post('/register' , register)
router.post('/login' , login)
router.post('/logout' , logout)
router.get('/verify-session' , verifyJWT , verifySession)

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', 
  passport.authenticate('github', { session: false, failureRedirect: 'http://localhost:3000/auth' }),
  authCallback
);


// Initial redirect to Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
  passport.authenticate('google', { 
    session: false, 
    failureRedirect: 'http://localhost:3000/auth' 
  }),
  authCallback
);



export default router