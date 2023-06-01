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
const userRoutes = require('./routes/userRoutes');
const { saveImageToUser } = require('./models/User');
const ObjectId = require('mongodb').ObjectId;

const userDB = require('./models/User');

userDB.connect().then(() => {
  console.log('Connected to MongoDB');
}).catch(err => console.error(err));

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
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when finished
    await client.close();
  }
}
run().catch(console.dir);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/auth', userRoutes);

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

// not being used right now
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
      //const base64Images = imageDocs.map((doc) => doc.content);
      //const imageIds = imageDocs.map((doc) => doc._id.toString());
      //return { base64Images, imageIds };
      return imageDocs;
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
  console.log("kommer hit3");
  console.log(images);

  if (images == null || !images || images.length === 0) {
    return null;
  }

  // Select a random image from the images array
  const randomImageDoc = images[Math.floor(Math.random() * images.length)];

  // Convert base64-encoded image to data URL
  const imageUrl = `data:image/jpeg;base64,${randomImageDoc.content}`;
  //console.log(randomImage._id);
  //console.log(images._id);

  return { imageUrl: imageUrl, imageId: randomImageDoc._id };
}


app.post('/api/get-images', async (req, res) => {
  const { trackName, artistName } = req.body;

  try {
    const imageData = await getImages(trackName, artistName);

    if (imageData == null) {
      return res.status(404).json({ error: 'No images found' });
    }
    res.json(imageData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while getting images from the database' });
  }
});


app.post('/api/save-image', async (req, res) => {
  const { username, imageId } = req.body;
  console.log(imageId);

  try {
    const saveResult = await saveImageToUser(username, imageId);

    if (saveResult) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Failed to save image' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while saving image' });
  }
});

app.get('/api/saved-images', async (req, res) => {
  const { username } = req.query;

  try {
    const savedImages = await getSavedImagesForUser(username);
    res.json(savedImages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while getting saved images' });
  }
});

async function getSavedImagesForUser(username) {
  try {
    await client.connect();

    const db = client.db("MoodTunes");

    const usersCollection = db.collection("users");
    const imagesCollection = db.collection("Images");

    // Find the user in the database
    const user = await usersCollection.findOne({ username });

    if (!user) {
      console.log(`User ${username} not found`);
      return null;
    }

    // If the user has no saved images, return an empty array
    if (!user.savedImages || user.savedImages.length === 0) {
      return [];
    }

    // For each image ID, retrieve the image from the Images collection
    let savedImages = [];
    for (let imageId of user.savedImages) {
      const imageDoc = await imagesCollection.findOne({ _id: new ObjectId(imageId) });

      if (imageDoc) {
        // Convert the base64-encoded image to a data URL
        const imageUrl = `data:image/jpeg;base64,${imageDoc.content}`;
        console.log(imageUrl);
        savedImages.push(imageUrl);
      } else {
        console.warn(`Image with ID ${imageId} not found`);
      }
    }

    return savedImages;
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    await client.close();
  }
}



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

