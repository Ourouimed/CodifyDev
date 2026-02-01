import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

// GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // We look for the user by their GitHub ID
      const user = await User.findOneAndUpdate(
        { githubId: profile.id }, 
        {
          // 1. $set: Updates these EVERY time the user logs in
          $set: { 
            githubId: profile.id,
            provider: 'github',
            lastLogin: new Date() // Useful for tracking activity
          },
          // 2. $setOnInsert: ONLY saves these if the user is being created (new)
          $setOnInsert: {
            username: profile.username ,
            displayName: profile.displayName,
            email: profile.emails?.[0]?.value,
            avatar: profile._json.avatar_url,
            bio: "", 
            banner: "" 
          }
        },
        { 
          new: true,    // Return the updated/created document
          upsert: true, // Create a new document if one isn't found
          runValidators: true 
        }
      );
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
    callbackURL: "http://localhost:5000/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await User.findOneAndUpdate(
        { googleId: profile.id },
        {
          // Updates these every time
          $set: { 
            googleId: profile.id,
            provider: 'google',
            lastLogin: new Date()
          },
          // Saves these ONLY on the very first login
          $setOnInsert: {
            username: profile.emails?.[0]?.value.split('@')[0],
            displayName: profile.displayName,
            email: profile.emails?.[0]?.value,
            avatar: profile.photos?.[0]?.value,
            bio: "",
            banner: ""
          }
        },
        { 
          new: true, 
          upsert: true,
          runValidators: true 
        }
      );
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

export default passport;