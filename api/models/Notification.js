import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
    {
        recipient: {
            type : Schema.Types.ObjectId ,
            ref : 'User' ,
            required : true
        },
        sender: {
            type : Schema.Types.ObjectId ,
            ref : 'User' ,
            required : true
        },
        type: {
            type: String,   
            enum: ['like', 'comment', 'follow' , 'comment_like'],
            required: true
        }, 
        post: {
            type : Schema.Types.ObjectId ,
            ref : 'Post'    
        },
        comment: {
            type : Schema.Types.ObjectId ,
            ref : 'Comment'
        } ,
        isRead: {
            type: Boolean,
            default: false
        },
        message: String ,
        createdAt: {type: Date,default: Date.now}
    }
)

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification