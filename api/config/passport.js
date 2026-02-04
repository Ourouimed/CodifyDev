import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import jwt from 'jsonwebtoken'
import { config } from 'dotenv';
import { generateUniqueUsername } from '../lib/generate-unique-username.js';

config()
const JWT_SECRET = process.env.JWT_SECRET  



// GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/github/callback",
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      let authenticatedUserId = null;
      const token = req.cookies?.token;

      if (token) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET);
          authenticatedUserId = decoded.id;
        } catch (err) {
          console.error("JWT Verification failed inside Passport:", err.message);
        }
      }

      // 1. LINKING LOGIC
      if (authenticatedUserId) {
        const existingLink = await User.findOne({ githubId: profile.id });
        if (existingLink) {
          if (existingLink._id.toString() !== authenticatedUserId) {
            return done(null, false, { message: 'This GitHub account is already linked to another profile.' });
          }
          return done(null, existingLink);
        }

        const linkedUser = await User.findByIdAndUpdate(
          authenticatedUserId,
          { $set: { githubId: profile.id, githubUsername: profile.username, lastLogin: new Date() } },
          { new: true, runValidators: true }
        );
        return done(null, linkedUser);
      }

      // 2. LOGIN / NEW USER LOGIC
      const email = profile.emails?.[0]?.value;
      
      // Look for user by GitHub ID or Email
      let user = await User.findOne({ 
        $or: [ { githubId: profile.id }, { email: email } ] 
      });

      if (user) {
        // If found by email but githubId wasn't set, link it now
        user.githubId = profile.id;
        user.githubUsername = profile.username;
        user.lastLogin = new Date();
        await user.save();
        return done(null, user);
      }

      // 3. NEW USER REGISTRATION: Use the helper for unique username
      // Use GitHub username as base, fall back to email prefix if needed
      const baseUsername = profile.username || email.split('@')[0];
      const uniqueUsername = await generateUniqueUsername(baseUsername);

      user = await User.create({
        githubId: profile.id,
        githubUsername: profile.username,
        email: email,
        username: uniqueUsername,
        displayName: profile.displayName || profile.username,
        avatar: profile._json.avatar_url,
        provider: 'github',
        lastLogin: new Date(),
        bio: "",
        banner: ""
      });

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));
// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/callback",
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      
      // 1. Check if user already exists by googleId or email
      let user = await User.findOne({ $or: [{ googleId: profile.id }, { email }] });

      if (user) {
        // Update existing user
        user.googleId = profile.id;
        user.lastLogin = new Date();
        await user.save();
        return done(null, user);
      }

      // 2. NEW USER: Handle Unique Username
      const baseUsername = email.split('@')[0];
      const uniqueUsername = await generateUniqueUsername(baseUsername);

      user = await User.create({
        googleId: profile.id,
        email: email,
        username: uniqueUsername,
        displayName: profile.displayName,
        avatar: profile.photos?.[0]?.value,
        provider: 'google',
        lastLogin: new Date()
      });

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

export default passport;