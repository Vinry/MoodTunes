//const fetch = require('node-fetch');

async function fetchLyrics(artistName, trackName) {
  try {
    //const apiUrl = `https://api.lyrics.ovh/v1/${artistName}/${trackName}`;
    const apiUrl = `https://lyrist.vercel.app/api/${trackName}/${artistName}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    return data;
  } catch (err) {
    console.error(err);
    throw new Error('An error occurred while fetching lyrics');
  }
}

module.exports = {
  fetchLyrics,
};
