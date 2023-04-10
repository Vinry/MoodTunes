require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const passport = require('./passport');
const session = require('express-session');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: '123',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
  })
);

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

app.get('/api/lyrics/:artistName/:trackName', async (req, res) => {
  const { artistName, trackName } = req.params;

  try {
    //const apiUrl = `https://api.lyrics.ovh/v1/${artistName}/${trackName}`;
    const apiUrl = `https://lyrist.vercel.app/api/${trackName}/${artistName}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching lyrics' });
  }
});

