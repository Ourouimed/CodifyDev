import mongoose, { Schema } from "mongoose";

const CommunitySchema = new Schema({
    name : { type : String , required : true }, 
    communityImage : { type : String }, 
    description : { type : String },
    visibility : { type : String , enum : ['public' , 'private'] , default : 'public' },
    members : [{ type : Schema.Types.ObjectId , ref : 'User'}],
    creator : { type : Schema.Types.ObjectId , ref : 'User' },
    required_post_approval : { type : Boolean , default : false } ,   
} , { timestamps : true })


const Community = mongoose.model('Community', CommunitySchema);
export default Community;