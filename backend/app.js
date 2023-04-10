require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const passport = require('./passport');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get('/auth/spotify', passport.authenticate('spotify', { scope: ['user-read-email', 'user-read-private'] }));

app.get(
  '/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  (req, res) => {
    //TODO: redirect when auth is sussessful.
    res.redirect('/');
  }
);
