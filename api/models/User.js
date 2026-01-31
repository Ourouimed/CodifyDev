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
    unique : true 

  } , 
  avatar: String,
  
  githubId: { type: String, unique: true, sparse: true },
  googleId: { type: String, unique: true, sparse: true },
  
  methods: [{ 
    type: String, 
    enum: ['local', 'github', 'google'] 
  }]
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User