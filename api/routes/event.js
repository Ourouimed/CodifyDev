import express from 'express'
import verifyJWT from '../middlewares/verifyJWT.js';
import { createEvent } from '../controllers/eventController.js';

const router = express.Router()


router.post('/create' , verifyJWT , createEvent)
export default router