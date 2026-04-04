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
  followers : {
    type : [{type : mongoose.Schema.Types.ObjectId , ref : 'User'}],
    default : []
  },
  following : {
    type : [{type : mongoose.Schema.Types.ObjectId , ref : 'User'}],
    default : []
  } ,
  location: String,
  linkedin: String,
  github: String,
  website: String  ,
  email_verified : { type : Boolean , default : false},
  email_verified_at : { type : Date , default : null} ,
  otp : {
    code : {
      type: String ,
      default : null
    },
    code_sent_at : { type : Date , default : null} 
  },
  reset_token : {
    token : { type : String , default : null} ,
    token_sent_at : { type : Date , default : null}
  }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User