import passport from 'passport' 
import { Strategy as GitHubStrategy} from 'passport-github2'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js'
// GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await User.findOneAndUpdate(
        { githubId: profile.id }, 
        {
          githubId: profile.id,
          username: profile.username,
          displayName: profile.displayName,
          email: profile.emails?.[0]?.value,
          avatar: profile._json.avatar_url,
          provider: 'github'
        },
        { new: true, upsert: true } // Create if doesn't exist, update if it does
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
          googleId: profile.id,
          username: profile.displayName,
          displayName: profile.displayName,
          email: profile.emails?.[0]?.value,
          avatar: profile.photos?.[0]?.value,
          provider: 'google'
        },
        { new: true, upsert: true }
      );
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));