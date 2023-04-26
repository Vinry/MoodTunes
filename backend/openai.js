const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();
const axios = require('axios');
const { MongoClient, GridFSBucket, ServerApiVersion } = require('mongodb');

//const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://marrelarsson:HzLFhGRGVpqP1fVm@cluster0.zspk9il.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function generateText(prompt) {
  try {
    console.log(prompt);



    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
          {role: 'system', content: 'You are an AI designed to generate prompts for an Image generation AI to create images that match the mood of the song lyrics you are given. Give only the prompt.'},
          {role: 'user', content: prompt},
      ],
      //prompt: prompt,
      max_tokens: 2000,
      //n: 1,
      stop: null,
      temperature: 1,
    });

    const assistantMessage = response.data.choices[0].message;
    console.log(assistantMessage);
    return assistantMessage.content;

  } catch (err) {
    console.error('Error calling OpenAI API:', err.message);
    console.error('Error details:', err);
  }
}

async function saveImages(trackName, artistName, imageData) {
  try {
    await client.connect();
    const db = client.db("MoodTunes");
    const images = db.collection("Images");
    console.log(trackName, artistName);

    const metadata = {
      trackName,
      artistName,
    };
    //const imageURL = imageData;
    //const response = await axios.get(imageURL, { responseType: "arraybuffer" });
    //const base64Image = Buffer.from(response.data, "binary").toString("base64");

    // Create a document to insert
    const doc = {
      song: trackName,
      artist: artistName,
      content: imageData,
    };

    const result = await images.insertOne(doc);


    console.log(`Images saved successfully with ID: ${result.insertedId}`);
  } catch (err) {
    console.error('Error saving images:', err);
  } finally {
    await client.close();
  }
}



async function generateImage(prompt, trackName, artistName) {
  try {
    console.log(prompt);
    console.log(trackName, artistName);

    const response = await openai.createImage({
      prompt: prompt,
      n: 4,
      size: '512x512',
    });

    const imageUrls = response.data.data.map((image) => image.url);
    console.log(imageUrls);
    // Download and save images
    for (const url of imageUrls) {
      const imageData = await axios.get(url, { responseType: 'arraybuffer' });
      //const buffer = Buffer.from(imageData.data);
      const base64Image = Buffer.from(imageData.data, "binary").toString("base64");
      await saveImages(trackName, artistName, base64Image);
    }

    return imageUrls;

  } catch (err) {
    console.error(err);
  }
}


module.exports = {
  generateText,
  generateImage,
};

