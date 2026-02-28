import User from "../models/User.js"
import Post from "../models/Post.js"
import bcrypt from 'bcryptjs'
import dotenv from "dotenv";
import jwt from 'jsonwebtoken'
import { uploadImage } from "../lib/upload-image.js";
import Notification from "../models/Notification.js"


dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET

// --- AUTH CONTROLLERS ---

const register = async (req, res) => {
    try {
        const { name, username, email, password, confirmPass } = req.body
        if (!name || !username || !email || !password || !confirmPass) {
            return res.status(401).json({ error: 'Some required fields are empty' })
        }

        const user = await User.findOne({ $or: [{ email }, { username }] })
        if (user) {
            return res.status(403).json({ error: 'User already exist' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await User.create({
            displayName: name,
            username,
            email,
            password: hashedPassword
        })

        return res.json({ message: 'User created successfully' })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal server error' })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const doc = await User.findOne({ email })
        if (!doc) {
            return res.status(404).json({ error: "User not found" })
        }

        const isMatch = await bcrypt.compare(password, doc.password)
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const payload = { id: doc._id, email: doc.email };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

        return res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
            maxAge: 3600000,
        }).json({
            message: "Login successful",
            user: {
                name: doc.displayName,
                email: doc.email,
                bio: doc.bio || "",
                location: doc.location || "",
                website: doc.website || "",
                linkedin: doc.linkedin || "",
                github: doc.github || "",
                banner: doc.banner || null,
                username: doc.username,
                avatar: doc.avatar || null,
                followers: doc.followers,
                following: doc.following,
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt,
                hasPassword : doc.password ? true : false, 
                ...(doc.githubUsername && { githubUsername: doc.githubUsername }),
                ...(doc.googleId && { googleId: doc.googleId })
            }
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const verifySession = async (req, res) => {
    try {
        const docUser = await User.findById(req.user.id)
        if (!docUser) {
            return res.status(401).json({ error: 'Session expired. Please login again.' });
        }

        return res.json({
            message: "Session valid",
            user: {
                name: docUser.displayName,
                email: docUser.email,
                bio: docUser.bio || "",
                location: docUser.location || "",
                website: docUser.website || "",
                linkedin: docUser.linkedin || "",
                github: docUser.github || "",
                banner: docUser.banner || null,
                username: docUser.username,
                avatar: docUser.avatar || null,
                followers: docUser.followers,
                following: docUser.following,
                createdAt: docUser.createdAt,
                updatedAt: docUser.updatedAt,
                hasPassword : docUser.password ? true : false, 
                ...(docUser.githubUsername && { githubUsername: docUser.githubUsername }),
                ...(docUser.googleId && { googleId: docUser.googleId }),
            }
        })
    } catch (err) {
        return res.status(401).json({ error: 'Session invalid' });
    }
}

const logout = async (req, res) => {
    return res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'lax',
    }).json({ message: 'Logout successful' })
}

// --- PROFILE CONTROLLERS ---

const getProfile = async (req, res) => {
    try {
        const { id } = req.params
        const profile = await User.findOne({ username: id })
        if (!profile) return res.status(404).json({ error: 'User not found' })

        return res.json({
            profile: {
                name: profile.displayName,
                email: profile.email,
                bio: profile.bio || "",
                location: profile.location || "",
                website: profile.website || "",
                linkedin: profile.linkedin || "",
                github: profile.github || "",
                banner: profile.banner || null,
                username: profile.username,
                avatar: profile.avatar || null,
                followers: profile.followers,
                following: profile.following,
                isFollowing: req.user?.id ? profile.followers.some(f => f.toString() === req.user.id.toString()) : false,
                createdAt: profile.createdAt,
                updatedAt: profile.updatedAt,
                ...(profile.githubUsername && { githubUsername: profile.githubUsername }),
                ...(profile.googleId && { googleId: profile.googleId }),
            }
        })
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

const updateProfile = async (req, res) => {
    try {
        const { name, username, bio, location, linkedin, github, website } = req.body
        const avatarFile = req.files?.['avatar']?.[0];
        const bannerFile = req.files?.['banner']?.[0];

        if (!name || !username) {
            return res.status(400).json({ error: 'Name and Username are required' })
        }

        // Check for conflicts
        const conflict = await User.findOne({ username , _id: { $ne: req.user.id }})
        if (conflict) {
            return res.status(403).json({ error: `username already taken` })
        }

        let avatar_url, banner_url;
        if (avatarFile?.buffer) avatar_url = await uploadImage(avatarFile.buffer, 'avatars')
        if (bannerFile?.buffer) banner_url = await uploadImage(bannerFile.buffer, 'banners')

        const updatedUser = await User.findByIdAndUpdate(req.user.id, {
            $set: {
                displayName: name,
                username: username,
                bio : bio ,
                location: location || "",
                linkedin: linkedin || "",
                github: github || "",
                website: website || "",
                ...(avatar_url && { avatar: avatar_url }),
                ...(banner_url && { banner: banner_url }),
            }
        }, { new: true, runValidators: true })

        res.json({
            message: 'User updated successfully',
            user: {
                name: updatedUser.displayName,
                email: updatedUser.email,
                bio: updatedUser.bio || "",
                location: updatedUser.location || "",
                website: updatedUser.website || "",
                linkedin: updatedUser.linkedin || "",
                github: updatedUser.github || "",
                username: updatedUser.username,
                avatar: updatedUser.avatar || null,
                banner: updatedUser.banner || null,
                followers: updatedUser.followers,
                following: updatedUser.following,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
            }
        })
    } catch (err) {
        console.log(err)
        if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid data format' })
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const followUnfollowUser = async (req, res) => {
    try {
        const { username } = req.params;
        const currentUser = await User.findById(req.user.id);
        const userToModify = await User.findOne({ username });

        if (!userToModify) return res.status(404).json({ error: "User not found" });
        if (userToModify._id.toString() === req.user.id.toString()) {
            return res.status(400).json({ error: "You cannot follow yourself" });
        }

        const isFollowing = currentUser.following.includes(userToModify._id);

        if (isFollowing) {
            await User.findByIdAndUpdate(userToModify._id, { $pull: { followers: req.user.id } });
            await User.findByIdAndUpdate(req.user.id, { $pull: { following: userToModify._id } });
            await Notification.findOneAndDelete({ recipient: userToModify._id, sender: req.user.id, type: 'follow' });
        } else {
            await User.findByIdAndUpdate(userToModify._id, { $addToSet: { followers: req.user.id } });
            await User.findByIdAndUpdate(req.user.id, { $addToSet: { following: userToModify._id } });
            await Notification.create({ recipient: userToModify._id, sender: req.user.id, type: 'follow' })
        }

        const updatedProfile = await User.findById(userToModify._id)
        res.json({ 
            message: 'Success', 
            profile: {
                name: updatedProfile.displayName,
                username: updatedProfile.username,
                avatar: updatedProfile.avatar,
                followers: updatedProfile.followers,
                isFollowing: !isFollowing
            } 
        });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};


const setEmail = async (req , res)=>{
    try {
        const userId = req.user.id
        const {email} = req.body
        if (!email){
            res.status(400).json({error : 'Email is required'})
        }

        const emailExists = await User.findOne({email})
        if (emailExists){
            res.status(400).json({error : 'This email is already taken'})
        }

        const updatedUser = await User.findByIdAndUpdate(userId , {email} , { new: true } )
        return res.json({
            message: 'Email set successfully',
            user: {
                name: updatedUser.displayName,
                email: updatedUser.email,
                bio: updatedUser.bio || "",
                location: updatedUser.location || "",
                website: updatedUser.website || "",
                linkedin: updatedUser.linkedin || "",
                github: updatedUser.github || "",
                username: updatedUser.username,
                avatar: updatedUser.avatar || null,
                banner: updatedUser.banner || null,
                hasPassword : updatedUser.password ? true : false, 
                followers: updatedUser.followers,
                following: updatedUser.following,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
            }
        })


    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal server error" });
    }
}


const setPassword = async (req, res) => {
    try {
        const { old_password, new_password, confirm_password } = req.body;

        if (!new_password) {
            return res.status(400).json({ error: 'New password is required!!' });
        }

        if (new_password !== confirm_password) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.password) {
            if (!old_password) {
                return res.status(400).json({ error: "Current password is required to set a new one" });
            }
            const isMatch = await bcrypt.compare(old_password, user.password);
            if (!isMatch) {
                return res.status(403).json({ error: 'Incorrect current password' });
            }
        }

        const hashedNewPassword = await bcrypt.hash(new_password, 10);
        
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id, 
            { password: hashedNewPassword }, 
            { new: true } 
        );

        return res.status(200).json({
            message: 'Password set successfully',
            user: {
                name: updatedUser.displayName,
                email: updatedUser.email,
                username: updatedUser.username,
                avatar: updatedUser.avatar || null,
                hasPassword: !!updatedUser.password,
                followers: updatedUser.followers,
                following: updatedUser.following,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}



const deleteAccount = async (req , res)=>{
    try {
        const userId = req.user.id 
        await Post.deleteMany({ author : userId})
        await Notification.deleteMany({ $or : [
            { sender: userId },
            { recipient: userId }
        ]})

        await User.updateMany(
            { followers: userId },
            { $pull: { followers: userId } }
        );

        await Post.updateMany(
            { likes: userId },
            { $pull: { likes: userId } }
        );

        await User.updateMany(
            { following: userId },
            { $pull: { following: userId } }
        );
        await User.findByIdAndDelete(userId)

        res.clearCookie("token");
        return res.status(200).json({ message: "Account deleted successfully" })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}


const authCallback = (req, res) => {
    const user = req.user
    if (!user) return res.redirect('http://localhost:3000/auth');
    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
        maxAge: 3600000,
    })
    res.redirect('http://localhost:3000/feed');
}

export { 
    register, login, verifySession, logout, setEmail , setPassword , 
    authCallback, updateProfile, getProfile, followUnfollowUser  , deleteAccount
}