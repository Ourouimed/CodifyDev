import express from 'express'
import verifyJWT from '../middlewares/verifyJWT.js'
import passport from 'passport';
import { authCallback, login, logout, register, updateProfile, verifySession } from '../controllers/authController.js'
import { config } from 'dotenv';
import multer from 'multer'


const router = express.Router()


// Use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });


config()
const JWT_SECRET = process.env.JWT_SECRET

router.post('/register' , register)
router.post('/login' , login)
router.post('/logout' , logout)
router.get('/verify-session' , verifyJWT , verifySession)
router.post('/profile/update' , verifyJWT , upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
  ]) , updateProfile)

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