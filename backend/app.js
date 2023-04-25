require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const passport = require('./passport');
const session = require('express-session');
const { generateText } = require('./openai');
const { fetchLyrics } = require('./lyricsApi');
const { generateImage } = require('./openai');


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

app.post('/api/generate-text', async (req, res) => {
  const { prompt } = req.body;

  try {
    const generatedText = await generateText(prompt);
    res.json({ text: generatedText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while generating text' });
  }
});

app.post('/api/generate-image', async (req, res) => {
  const { prompt } = req.body;

  try {
    const imageUrl = await generateImage(prompt);
    res.json({ url: imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while generating an image' });
  }
});

app.get('/api/lyrics/:artistName/:trackName', async (req, res) => {
  const { artistName, trackName } = req.params;

  try {
    const data = await fetchLyrics(artistName, trackName);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching lyrics' });
  }
});

