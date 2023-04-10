import React, { useState } from 'react';
import BackgroundSlideshow from './BackgroundSlideshow';
import LoginBox from './LoginBox';
import './App.css';

function App() {
  const [trackName, setTrackName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [lyrics, setLyrics] = useState('');

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
  
  

  
  const handleGetLyrics = async () => {
    const fetchedLyrics = await fetchLyrics(trackName, artistName);
    setLyrics(fetchedLyrics);
  };

  return (
    <div className="app">
      <BackgroundSlideshow />
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
