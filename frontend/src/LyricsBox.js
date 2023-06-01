import React, { useState, useEffect } from 'react';
import api from './Api';

const LyricsBox = ({ loggedIn, setLoggedIn, currentUser, setGeneratedImageUrls }) => {
  const [trackName, setTrackName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [fetchedImages, setFetchedImages] = useState(false);
  const [imageGenerated, setImageGenerated] = useState(false);
  //const [currentUser, setCurrentUser] = useState(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [imageObjectId, setImageObjectId] = useState(null);

  useEffect(() => {
  if (lyrics && !fetchedImages) {
    const fetchImagesAndSetUrls = async () => {
      // First, check if there are saved images in the database
      const savedImages = await api.getImages(trackName, artistName);

      if (savedImages && savedImages.imageUrl) {
        // If there are saved images, use them
        setGeneratedImageUrl(savedImages.imageUrl);
        console.log(savedImages.imageId);
        setImageObjectId(savedImages.imageId);
      } else {
        // If there are no saved images, generate new ones
        const generatedImage = await api.generateImage(lyrics, trackName, artistName);
        if (generatedImage) {
          setGeneratedImageUrl(generatedImage.imageUrl);
          setImageObjectId(generatedImage.imageId);
        } else {
            console.error('Error: generatedImage is null');
        }
      }
      setImageGenerated(true);
      setFetchedImages(true);
    };

    fetchImagesAndSetUrls();
  }
}, [lyrics, trackName, artistName, fetchedImages]);



  async function fetchLyrics(trackName, artistName) {
    try {
      const apiUrl = `http://localhost:3001/api/lyrics/${artistName}/${trackName}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        console.error('Error fetching lyrics:', response.status, response.statusText);
        return;
      }
      const data = await response.json();
      return data.lyrics;
    } catch (err) {
      console.error(err);
    }
  }

  const handleGetLyrics = async () => {
    const fetchedLyrics = await fetchLyrics(trackName, artistName);
    if (fetchedLyrics) {
      const generatedMessage = await api.fetchGeneratedText(fetchedLyrics);
      console.log(generatedMessage);
    } else {
      console.log('failed to fetch lyrics');
    }
    setLyrics(fetchedLyrics);
  };

  const handleSaveImage = async () => {
  // Assuming your api.saveImage function takes a username and an image URL,
  // and handles the database operations.
  console.log(currentUser);
  console.log(imageObjectId);
  const saved = await api.saveImage(currentUser, imageObjectId);
  if (saved) {
    console.log('Image saved successfully');
    // Do anything else you need to do after successful save
  } else {
    console.error('Error saving image');
  }
};


  const handleGenerateNewImage = async () => {
  // You can basically call handleGetLyrics again to generate a new image
    setFetchedImages(false);
    setGeneratedImageUrl(null);
    handleGetLyrics();
  };

  return loggedIn ? (
  <div>
    <div className="lyrics-input">
      <input
        type="text"
        placeholder="Track name"
        value={trackName}
        onChange={(e) => setTrackName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Artist name"
        value={artistName}
        onChange={(e) => setArtistName(e.target.value)}
      />
      <button onClick={handleGetLyrics}>Get Lyrics</button>
    </div>
    <div className="lyrics-output">
      <pre>{lyrics}</pre>
    </div>
    {generatedImageUrl ? (
      <div className="generated-image">
        <img src={generatedImageUrl} alt="Generated" />
      </div>
    ) : null}
    {imageGenerated && (
      <div className="image-actions">
        <button onClick={handleSaveImage}>Save Image</button>
        <button onClick={handleGenerateNewImage}>Generate New Image</button>
      </div>
    )}
  </div>
) : null;

}

export default LyricsBox;
