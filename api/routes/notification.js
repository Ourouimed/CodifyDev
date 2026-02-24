import express from 'express';
import verifyJWT from '../middlewares/verifyJWT.js';
import Notification from '../models/Notification.js';
const router = express.Router();

router.get('/' , verifyJWT , async (req , res)=>{
    try {
        const userId = req.user.id
        const notifications = await Notification.find({recipient : userId})
                                                .populate('sender' , 'username avatar displayName')
                                                .sort({createdAt : -1})
                                                .limit(5)
        return res.json({message : "Notifications fetched successfully" , notifications})
    }
    catch (err) {   
        console.error(err);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
})


router.post('/read-notification/:id' , verifyJWT , async (req , res)=>{
    try {
        const { id } = req.params
        const notification = await Notification.findByIdAndUpdate(id , {isRead : true})
        return res.json({message : "Notification marked as read successfully" , notification})
    }
    catch(err) {
        console.error(err)
        return res.status(500).json({
            error: 'Internal server error'
        })
    }
})

export default router;