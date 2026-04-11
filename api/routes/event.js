import express from 'express'
import verifyJWT from '../middlewares/verifyJWT.js';
import { createEvent, getEventById, getEvents, joinEvent } from '../controllers/eventController.js';

const router = express.Router()

router.get('/' , verifyJWT , getEvents)
router.get('/event/:id' , verifyJWT , getEventById)
router.post('/create' , verifyJWT , createEvent)
router.post('/join/:id' , verifyJWT , joinEvent)
export default router