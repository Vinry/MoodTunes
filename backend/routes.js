/*const express = require('express');
const router = express.Router();
const { fetchLyrics, fetchGeneratedText } = require('./lyricsApi', './openai');

router.post('/generate-message', async (req, res) => {
  try {
    const { trackName, artistName } = req.body;
    const lyrics = await fetchLyrics(trackName, artistName);

    if (lyrics) {
      const generatedMessage = await fetchGeneratedText(lyrics);
      res.json({ message: generatedMessage });
    } else {
      res.status(400).json({ error: 'Failed to fetch lyrics' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
*/
