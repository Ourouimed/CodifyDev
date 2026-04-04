import User from "../models/User.js";
import Post from "../models/Post.js";
import bcrypt from 'bcryptjs';
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
import CryptoJS from "crypto-js";
import { uploadImage } from "../lib/upload-image.js";
import Notification from "../models/Notification.js";
import { generateOtp } from "../lib/generate-otp.js";
import { sendVerificationEmail } from "../lib/send-email.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// --- Helper to standardize user response ---
const formatUserResponse = (user) => ({
    name: user.displayName,
    email: user.email,
    username: user.username,
    avatar: user.avatar || null,
    banner: user.banner || null,
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
    linkedin: user.linkedin || "",
    github: user.github || "",
    followers: user.followers,
    following: user.following,
    hasPassword: !!user.password,
    email_verified: user.email_verified || false,
    email_verified_at: user.email_verified_at || null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    ...(user.githubUsername && { githubUsername: user.githubUsername }),
    ...(user.googleId && { googleId: user.googleId })
});

// --- AUTH CONTROLLERS ---

const register = async (req, res) => {
    try {
        const { name, username, email, password, confirmPass } = req.body;
        if (!name || !username || !email || !password || !confirmPass) {
            return res.status(401).json({ error: 'Some required fields are empty' });
        }

        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) return res.status(403).json({ error: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOtp(6);
        const hashedOtp = CryptoJS.SHA256(otp).toString();

        await sendVerificationEmail(email, otp);

        const newUser = await User.create({
            displayName: name,
            username,
            email,
            password: hashedPassword,
            otp: { code: hashedOtp, code_sent_at: new Date() },
            provider: 'email'
        });

        return res.json({
            message: 'User created successfully',
            user: formatUserResponse(newUser)
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) return res.status(400).json({ error: "All fields are required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "Invalid credentials" });

        if (!user.password) {
            return res.status(400).json({
                error: `This account uses ${user.provider} login. Please sign in with ${user.provider.charAt(0).toUpperCase() + user.provider.slice(1)}.`
            });
        }

        if (!user.email_verified && user.provider === 'email') {
            return res.status(404).json({ error: "Email not verified, please check your inbox" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

        return res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
            maxAge: 3600000,
        }).json({
            message: "Login successful",
            user: formatUserResponse(user)
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const verifySession = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(401).json({ error: 'Session expired. Please login again.' });

        return res.json({
            message: "Session valid",
            user: formatUserResponse(user)
        });
    } catch (err) {
        return res.status(401).json({ error: 'Session invalid' });
    }
};

const logout = async (req, res) => {
    return res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'lax',
    }).json({ message: 'Logout successful' });
};

// --- OTP CONTROLLERS ---

const verifyOtp = async (req, res) => {
    const { otp: otpSent, email } = req.body;
    try {
        if (!otpSent || !email) return res.status(401).json({ error: 'Some required fields are empty' });

        const user = await User.findOne({ email }, { otp: 1, email_verified: 1 });
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (user.email_verified) return res.status(400).json({ error: 'Email already verified' });

        const hashedOtp = CryptoJS.SHA256(otpSent).toString();
        if (user.otp.code !== hashedOtp) return res.status(401).json({ error: "Invalid otp code" });

        const diffMinutes = Math.floor((new Date() - new Date(user.otp.code_sent_at)) / (1000 * 60));
        if (diffMinutes > 10) return res.status(401).json({ error: 'Otp code expired' });

        await User.findOneAndUpdate({ email }, {
            $set: {
                otp: { code: null, code_sent_at: null },
                email_verified: true,
                email_verified_at: new Date()
            }
        });

        const updatedUser = await User.findOne({ email });
        return res.json({ message: 'Email verified successfully', user: formatUserResponse(updatedUser) });

    } catch (err) {
        console.error(err);
        if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid data format' });
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const resendOtp = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (user.email_verified) return res.status(400).json({ error: 'Email already verified' });

        const otp = generateOtp(6);
        const hashedOtp = CryptoJS.SHA256(otp).toString();
        await sendVerificationEmail(email, otp);

        await User.findOneAndUpdate({ email }, {
            $set: { otp: { code: hashedOtp, code_sent_at: new Date() } }
        });

        return res.json({ message: "Otp resent successfully" });

    } catch (err) {
        console.error(err);
        if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid data format' });
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// --- PROFILE CONTROLLERS ---

const getProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await User.findOne({ username: id });
        if (!profile) return res.status(404).json({ error: 'User not found' });

        return res.json({
            profile: {
                ...formatUserResponse(profile),
                isFollowing: req.user?.id ? profile.followers.some(f => f.toString() === req.user.id.toString()) : false
            }
        });
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, username, bio, location, linkedin, github, website } = req.body;
        const avatarFile = req.files?.['avatar']?.[0];
        const bannerFile = req.files?.['banner']?.[0];

        if (!name || !username) return res.status(400).json({ error: 'Name and Username are required' });

        const conflict = await User.findOne({ username, _id: { $ne: req.user.id } });
        if (conflict) return res.status(403).json({ error: 'Username already taken' });

        let avatar_url, banner_url;
        if (avatarFile?.buffer) avatar_url = await uploadImage(avatarFile.buffer, 'avatars');
        if (bannerFile?.buffer) banner_url = await uploadImage(bannerFile.buffer, 'banners');

        const updatedUser = await User.findByIdAndUpdate(req.user.id, {
            $set: {
                displayName: name,
                username,
                bio,
                location: location || "",
                linkedin: linkedin || "",
                github: github || "",
                website: website || "",
                ...(avatar_url && { avatar: avatar_url }),
                ...(banner_url && { banner: banner_url }),
            }
        }, { new: true, runValidators: true });

        res.json({ message: 'User updated successfully', user: formatUserResponse(updatedUser) });

    } catch (err) {
        console.error(err);
        if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid data format' });
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const setEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const emailExists = await User.findOne({ email });
        if (emailExists) return res.status(400).json({ error: 'This email is already taken' });


        const otp = generateOtp(6);
        const hashedOtp = CryptoJS.SHA256(otp).toString();

        await sendVerificationEmail(email, otp);


        const updatedUser = await User.findByIdAndUpdate(req.user.id, { 
            email ,
            otp : {
                code : hashedOtp ,
                code_sent_at : new Date()
            }
         }, { new: true });
        res.json({ message: 'Email set successfully', user: formatUserResponse(updatedUser) });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const setPassword = async (req, res) => {
    try {
        const { old_password, new_password, confirm_password } = req.body;
        if (!new_password) return res.status(400).json({ error: 'New password is required' });
        if (new_password !== confirm_password) return res.status(400).json({ error: 'Passwords do not match' });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (user.password) {
            if (!old_password) return res.status(400).json({ error: "Current password is required" });
            const isMatch = await bcrypt.compare(old_password, user.password);
            if (!isMatch) return res.status(403).json({ error: 'Incorrect current password' });
        }

        const hashedNewPassword = await bcrypt.hash(new_password, 10);
        const updatedUser = await User.findByIdAndUpdate(req.user.id, { password: hashedNewPassword }, { new: true });

        return res.status(200).json({ message: 'Password set successfully', user: formatUserResponse(updatedUser) });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const followUnfollowUser = async (req, res) => {
    try {
        const { username } = req.params;
        const currentUser = await User.findById(req.user.id);
        const userToModify = await User.findOne({ username });

        if (!userToModify) return res.status(404).json({ error: "User not found" });
        if (userToModify._id.toString() === req.user.id.toString()) return res.status(400).json({ error: "You cannot follow yourself" });

        const isFollowing = currentUser.following.includes(userToModify._id);

        if (isFollowing) {
            await User.findByIdAndUpdate(userToModify._id, { $pull: { followers: req.user.id } });
            await User.findByIdAndUpdate(req.user.id, { $pull: { following: userToModify._id } });
            await Notification.findOneAndDelete({ recipient: userToModify._id, sender: req.user.id, type: 'follow' });
        } else {
            await User.findByIdAndUpdate(userToModify._id, { $addToSet: { followers: req.user.id } });
            await User.findByIdAndUpdate(req.user.id, { $addToSet: { following: userToModify._id } });
            await Notification.create({ recipient: userToModify._id, sender: req.user.id, type: 'follow' });
        }

        const updatedProfile = await User.findById(userToModify._id);
        res.json({ message: 'Success', profile: { ...formatUserResponse(updatedProfile), isFollowing: !isFollowing } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        await Post.deleteMany({ author: userId });
        await Notification.deleteMany({ $or: [{ sender: userId }, { recipient: userId }] });
        await User.updateMany({ followers: userId }, { $pull: { followers: userId } });
        await User.updateMany({ following: userId }, { $pull: { following: userId } });
        await Post.updateMany({ likes: userId }, { $pull: { likes: userId } });
        await User.findByIdAndDelete(userId);

        res.clearCookie("token");
        return res.status(200).json({ message: "Account deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const authCallback = (req, res) => {
    const user = req.user;
    if (!user) return res.redirect('http://localhost:3000/auth');

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
        maxAge: 3600000,
    });
    res.redirect('http://localhost:3000/feed');
};

export {
    register,
    login,
    verifySession,
    logout,
    setEmail,
    setPassword,
    verifyOtp,
    resendOtp,
    authCallback,
    updateProfile,
    getProfile,
    followUnfollowUser,
    deleteAccount
};