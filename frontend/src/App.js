import React, { useState, useEffect } from 'react';
import BackgroundSlideshow from './BackgroundSlideshow';
import LoginBox from './LoginBox';
import './App.css';
import api, { generateImage, getImages } from './Api';
import MenuBar from './MenuBar';

const defaultImages = [
  '/image1.jpeg',
  '/image2.jpeg',
  // ...other default images
  ];


function App() {
  const [trackName, setTrackName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [generatedImageUrls, setGeneratedImageUrls] = useState([]);
  const [showBoxes, setShowBoxes] = useState(true);
  const [fetchedImages, setFetchedImages] = useState(false);
  //const [images, setImages] = useState(defaultImages);




  useEffect(() => {
    if (lyrics && !fetchedImages) {
      const fetchImagesAndSetUrls = async () => {
        // First, check if there are saved images in the database
        const savedImageUrls = await api.getImages(trackName, artistName);
        console.log('Fetched images from database:', savedImageUrls);
        //console.log("Saved image URLs length:", savedImageUrls.urls.length);

        if (savedImageUrls && savedImageUrls.urls && savedImageUrls.urls.length > 0) {
          // If there are saved images, use them
          setGeneratedImageUrls(savedImageUrls.urls);
          //setImages([...defaultImages, ...savedImageUrls.urls]);
          console.log("kommer hit");
          console.log('Set generatedImageUrls with fetched images:', savedImageUrls);
        } else {
          // If there are no saved images, generate new ones
          const generatedImageUrls = await api.generateImage(lyrics, trackName, artistName);
          setGeneratedImageUrls(generatedImageUrls);
          //setImages([...defaultImages, ...generatedImageUrls]);
        }
        setFetchedImages(true);
      };

      fetchImagesAndSetUrls();
      /*const generateImagesAndSetUrls = async () => {
        const imageUrls = await api.generateImage(lyrics, trackName, artistName);
        setGeneratedImageUrls(imageUrls);
      };

      generateImagesAndSetUrls();*/
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
  
  const images = generatedImageUrls && generatedImageUrls.length > 0 ? generatedImageUrls : defaultImages;


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

  return (
  <div className="app">
    <MenuBar onToggleBoxes={() => setShowBoxes(!showBoxes)} />
    <BackgroundSlideshow images={images} />
    <div className="login-container">
      {showBoxes && (
        <>
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
        </>
      )}
      <div className="lyrics-output">
        <pre>{lyrics}</pre>
      </div>
    </div>
  </div>
);

}

export default App;
