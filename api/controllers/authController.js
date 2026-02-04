import User from "../models/User.js"
import bcrypt from 'bcryptjs'
import dotenv from "dotenv";
import jwt from 'jsonwebtoken'
import { uploadImage } from "../lib/upload-image.js";

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET


const register = async (req , res)=>{
    try {
        const { name , username , email , password , confirmPass} = req.body
        if (!name || !username || !email || !password || !confirmPass){
            return res.status(401).json({
                error : 'Some required fields are empty'
            })
        }

    const user = await User.findOne({$or : [{email} , {username}] })
    if (user){
        return res.status(403).json({
            error : 'User already exist'
        })
    }


    const hashedPassword = await bcrypt.hash(password , 10)

    await User.create({
        displayName : name , username , email , password : hashedPassword
    })

    return res.json({message : 'User created successfully'})



    }

    catch (err){
        console.log(err)
        res.status(500).json({error : 'Internal server error'})
    }
}


const login = async (req, res) => {
   

    const { email, password } = req.body;

    try {
        if (!email || !password) {
        return res.status(400).json({ error: "All fields are required" });
        }

        const doc = await User.findOne({email})
        if (!doc) {
            return res.status(404).json({error : "User not found"})
        }

        const isMatch = await bcrypt.compare(password , doc.password)
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

         // Generate JWT token
        const payload = { id: doc._id , email: doc.email};
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
        

        return res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
            maxAge: 3600000,
        }).json({
            message: "Login successful", user : {
                name : doc.displayName , 
                email : doc.email ,
                bio : doc.bio || "",
                banner : doc.banner || null ,
                username : doc.username ,
                avatar : doc.avatar || null ,
                createdAt : doc.createdAt , updatedAt : doc.updatedAt
            }})
    }

    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const verifySession = async (req, res) => {
    try {
        const docUser = await User.findById(req.user.id)
        if (!docUser) {
            return res.status(401).json({ error: 'Session expired or invalid. Please login again.' });
        }

        return res.json({
            message: "Session valid", user : {
                name : docUser.displayName , 
                email : docUser.email ,
                bio : docUser.bio || "",
                banner : docUser.banner || null ,
                username : docUser.username ,
                avatar : docUser.avatar || null ,
                createdAt : docUser.createdAt , updatedAt : docUser.updatedAt ,
                ...(docUser.githubUsername && { githubUsername: docUser.githubUsername }),
                ...(docUser.googleId && { googleId: docUser.googleId }),
            }})
    }
    catch (err) {
        console.error(err);
        return res.status(401).json({ error: 'Session expired or invalid. Please login again.' });
    }
}


const logout = async (req, res) => {
    return res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'lax',
    }).json({ message: 'Logout successfull', })
}


const getProfile = async (req , res)=>{
    try {
        const { id } = req.params

        if (!id){
            return res.status(400).json({error : 'Id is required'})
        }

        const profile = await User.findOne({username : id})
        if (!profile){
            return res.status(404).json({error : 'User not found'})
        }


        return res.json({profile : {
                name : profile.displayName , 
                email : profile.email ,
                bio : profile.bio || "",
                banner : profile.banner || null , 
                username : profile.username ,
                avatar : profile.avatar || null ,
                createdAt : profile.createdAt , updatedAt : profile.updatedAt , 
                ...(profile.githubUsername && { githubUsername: profile.githubUsername }),
                ...(profile.googleId && { googleId: profile.googleId }),
            }})
    }

    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
    
}

const authCallback = (req, res) => {
    const user = req.user

    if (!user) return res.redirect('http://localhost:3000/auth');

    
    const payload = { id: user._id , email: user.email};
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
            
    
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
        maxAge: 3600000,
    })
    res.redirect('http://localhost:3000/feed');
  }


const updateProfile = async (req , res)=>{
    try {
        const { name , username , bio , avatar} = req.body
        const avatarFile = req.files?.['avatar']?.[0];
        const bannerFile = req.files?.['banner']?.[0];

        if (!name || !username){
            return res.status(400).json({error : 'Some required fields are missing'})
        }

        let avatar_url
        let banner_url

        if (avatarFile?.buffer){
            avatar_url = await uploadImage(avatarFile?.buffer , 'avatars')
        }

        if (bannerFile?.buffer){
            banner_url = await uploadImage(bannerFile?.buffer , 'banners')
        }
        const updatedUser = await User.findByIdAndUpdate(req.user.id , {
                $set: {
                    name: req.body.name,
                    bio: req.body.bio,
                    ...(avatar_url && { avatar: avatar_url }),
                    ...(banner_url && { banner: banner_url }),
                }
            },
            { new: true })
        res.json({message : 'User updated successfully' , user : {
                name : updatedUser.displayName , 
                email : updatedUser.email ,
                bio : updatedUser.bio || "",
                banner : updatedUser.banner || null , 
                username : updatedUser.username ,
                avatar : updatedUser.avatar || null ,
                createdAt : updatedUser.createdAt , updatedAt : updatedUser.updatedAt , 
                ...(updatedUser.githubUsername && { githubUsername: updatedUser.githubUsername }),
                ...(updatedUser.googleId && { googleId: updatedUser.googleId }),
            }})
    }

    catch (err){
        console.log(err)
        return res.status(500).json({
            error : 'Internal server error'
        })
    }
}


export { register , login , verifySession , logout , authCallback , updateProfile , getProfile}