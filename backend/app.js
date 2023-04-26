require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const passport = require('./passport');
const session = require('express-session');
const { generateText } = require('./openai');
const { fetchLyrics } = require('./lyricsApi');
const { generateImage } = require('./openai');
const fs = require("fs");

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://marrelarsson:HzLFhGRGVpqP1fVm@cluster0.zspk9il.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    /*const database = client.db("test");
    const collection = database.collection("test1");

    const imagePath = "/home/martin/skola/TDDD27/tddd27_2023_moodtunes/backend/test/image1.jpeg";
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");
    const doc = {
      title: "Sample Image",
      content: base64Image,
    }
    const result = await collection.insertOne(doc);
    console.log("doc inserted");*/
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);




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


async function searchImagesInDatabase(trackName, artistName) {
  try {
    await client.connect();
    const db = client.db("MoodTunes");
    const images = db.collection("Images");
    console.log(trackName, artistName);

    const trackToFind = trackName;
    const imageDocs = await images.find({ song: trackName }).toArray();

    if (imageDocs.length > 0) {
      console.log("Images found");
      const base64Images = imageDocs.map((doc) => doc.content);
      return base64Images;
    } else {
      console.log("Images not found");
      return null;
    }

  } catch (err) {
    console.error('Error finding images:', err);
    return null;
  } finally {
    await client.close();
  }
}



async function getImages(trackName, artistName) {
  // Search for images in the database using trackName and artistName
  const images = await searchImagesInDatabase(trackName, artistName);

  if (!images || images.length === 0) {
    return null;
  }

  // Convert base64-encoded images to data URLs
  const imageUrls = images.map((base64Image) => {
    return `data:image/jpeg;base64,${base64Image}`;
  });

  return imageUrls;
}


app.post('/api/get-images', async (req, res) => {
  const { trackName, artistName } = req.body;

  try {
    const imageUrls = await getImages(trackName, artistName);
    //console.log(imageUrls);
    res.json({ urls: imageUrls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while getting images from the database' });
  }
});




app.post('/api/generate-image', async (req, res) => {
  const { prompt, trackName, artistName } = req.body;

  try {
    // Check if images are already stored in the database
    const storedImages = await getImages(trackName, artistName);

    if (storedImages) {
      // if images are found, return the stored images
      res.json({ urls: storedImages });
    } else {
      // if no images are found, generate new images
      const imageUrl = await generateImage(prompt, trackName, artistName);
      res.json({ url: imageUrl });
    }
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

