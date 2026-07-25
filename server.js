require('dotenv').config();

const express= require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalAuth = require('passport-local').Strategy;
const GoogleAuth = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const mongodb = require('./data/database');
const User = require('./models/users');

const app = express();
const port = process.env.PORT || 3000;

//----------------- Middlewares -----------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

//----------------- Session Setup -----------------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// ----------------- Passport Setup -----------------
app.use(passport.initialize());
app.use(passport.session());

// ----------------- Passport Session Helpers -----------------
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// ----------------- Local Login  -----------------
passport.use(
  new LocalAuth(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user || !user.password) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// ----------------- Google OAuth -----------------
passport.use(
  new GoogleAuth(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email: profile.emails?.[0]?.value }],
        });

        if (!user) {
          user = await User.create({
            firstName: profile.name?.givenName || 'Google',
            lastName: profile.name?.familyName || 'User',
            email: profile.emails?.[0]?.value,
            googleId: profile.id,
            authMethod: 'google',
          });
        } else {
          if (!user.googleId) {
            user.googleId = profile.id;
            user.authMethod = 'google';
            await user.save();
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);


app.use('/', require('./routes'));

//Start server:
const startServer = async () => {
  try {
    await mongodb.initDb();
    app.listen(port, () => {
      console.log(`Database is connected and node is running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to database:', err);
  }
};

startServer();