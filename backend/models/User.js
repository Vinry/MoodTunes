const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://marrelarsson:HzLFhGRGVpqP1fVm@cluster0.zspk9il.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let usersCollection;

async function connect() {
  await client.connect();
  usersCollection = client.db("MoodTunes").collection("users");
}

async function findUser(username) {
  if (!usersCollection) throw new Error("Database connection not established");
  const user = await usersCollection.findOne({ username });
  return user;
}

async function createUser(username, password) {
  if (!usersCollection) throw new Error("Database connection not established");
  return await usersCollection.insertOne({ username, password });
}

async function saveImageToUser(username, imageId) {
  try {
    console.log(`Attempting to save imageId ${imageId} for user ${username}`);
    // Find the user in the database
    const user = await usersCollection.findOne({ username });

    if (!user) {
      console.log(`User ${username} not found`);
      return false;
    }

    // Add the new imageId to the user's savedImages array
    const savedImages = user.savedImages || []; // If user.savedImages is not defined, initialize it to an empty array
    savedImages.push(imageId);

    // Save the user back to the database
    await usersCollection.updateOne({ username }, { $set: { savedImages: savedImages } });

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}



module.exports = { connect, createUser, findUser, saveImageToUser };
