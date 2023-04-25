import React, { useState, useEffect } from 'react';
import BackgroundSlideshow from './BackgroundSlideshow';
import LoginBox from './LoginBox';
import './App.css';
import api, { generateImage } from './Api';

function App() {
  const [trackName, setTrackName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [generatedImageUrls, setGeneratedImageUrls] = useState([]);

  useEffect(() => {
    if (lyrics) {
      const generateImagesAndSetUrls = async () => {
        const imageUrls = await api.generateImage(lyrics);
        setGeneratedImageUrls(imageUrls);
      };

      generateImagesAndSetUrls();
    }
  }, [lyrics]);

  async function fetchLyrics(trackName, artistName) {
    try {
      const apiUrl = `http://localhost:3001/api/lyrics/${artistName}/${trackName}`;
      //const response = await fetch(`https://lyrist.vercel.app/api/${trackName}/${artistName}`);
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
  
  

  //const generatedText = await api.fetchGeneratedText(prompt);
  
  const handleGetLyrics = async () => {
    const fetchedLyrics = await fetchLyrics(trackName, artistName);
    if (fetchedLyrics) {
      const generatedMessage = await api.fetchGeneratedText(fetchedLyrics);
      console.log(generatedMessage);
      //const generatedImageUrl = await api.generateImage(generatedMessage);
      //console.log('Generated Image URL:', generatedImageUrl);
    } else {
      console.log('failed to fetch lyrics');
    }
    setLyrics(fetchedLyrics);
  };



  const defaultImages = [
  '/image1.jpeg',
  '/image2.jpeg',
  // ...other default images
  ];
  // check if there are generated images, create new array with the images
  //otherwise, just show default images
  const images = generatedImageUrls.length > 0 ? [...generatedImageUrls] : defaultImages;



  if (generatedImageUrls) {
    images.push(generatedImageUrls);
  }
  console.log(images);

  return (
    <div className="app">
      <BackgroundSlideshow images={images} />
      <div className="login-container">
        <LoginBox />
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
      </div>
    </div>
  );
}

export default App;
