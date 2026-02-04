import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    unique: true, 
    sparse: true 
  },
  password: { 
    type: String, 
  },
  displayName: String,
  username : {
    type : String, 
    unique : true ,
    lowercase: true
  } , 
  avatar: String,
  banner : String , 
  bio : String , 
  provider: String , 
  githubId: { type: String, unique: true, sparse: true },
  githubUsername : { type: String, unique: true, sparse: true ,  lowercase: true},
  googleId: { type: String, unique: true, sparse: true },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User