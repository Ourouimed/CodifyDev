import User from "../models/User.js"
import bcrypt from 'bcryptjs'
import dotenv from "dotenv";
import jwt from 'jsonwebtoken'

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

        console.log(doc)

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
                username : doc.username ,
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
                username : docUser.username ,
                createdAt : docUser.createdAt , updatedAt : docUser.updatedAt
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


const githubAuthLogin = (req, res) => {
    const user = req.user
    const payload = { id: user._id , email: user.email};
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
            
    
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
        maxAge: 3600000,
    })
    res.redirect('http://localhost:3000');
  }


export { register , login , verifySession , logout , githubAuthLogin}