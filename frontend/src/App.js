import React, { useState, useEffect } from 'react';
import BackgroundSlideshow from './BackgroundSlideshow';
import LoginBox from './LoginBox';
import './App.css';
import api, { generateImage, getImages } from './Api';
import MenuBar from './MenuBar';
import LyricsBox from './LyricsBox';
import Sidebar from "./Sidebar";
import HamburgerMenu from "./HamburgerMenu";
import SavedImagesBox from './SavedImagesBox';


const defaultImages = [
  '/image1.jpeg',
  '/image2.jpeg',
  ];


function App() {
  const [generatedImageUrls, setGeneratedImageUrls] = useState([]);
  const [showBoxes, setShowBoxes] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginBox, setShowLoginBox] = useState(false);
  const [showLyricsBox, setShowLyricsBox] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showSavedImages, setShowSavedImages] = useState(false);
  const [savedImages, setSavedImages] = useState([]);
  //const [images, setImages] = useState(defaultImages);

  const images = generatedImageUrls && generatedImageUrls.length > 0 ? generatedImageUrls : defaultImages;

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const onLogin = () => {
    setShowLoginBox(true);
  };

  const onLogout = () => {
    setLoggedIn(false);
    setShowLoginBox(false);
    setShowLyricsBox(false);
  };

  const onRegister = () => {
    setShowLoginBox(true);
  };

  const onGenerateImages = () => {
    if (loggedIn) {
      setShowLyricsBox(true);
    } else {
      alert("Please login first to generate images.");
    }
  };

  const onViewSavedImages = async () => {
    if (loggedIn) {
      const images = await api.getSavedImages(currentUser);
      setSavedImages(images);
      setShowSavedImages(true);
      setShowLyricsBox(false);
    }
  }


  useEffect(() => {
  if (localStorage.getItem('loggedIn')) {
    setLoggedIn(true);
  }
}, []);



  <LyricsBox
    loggedIn={loggedIn}
    generatedImageUrls={generatedImageUrls}
    setGeneratedImageUrls={setGeneratedImageUrls}
  />
  return (
    <div className="app">
      <HamburgerMenu toggle={toggle} />
      <Sidebar
        isOpen={isOpen}
        toggle={toggle}
        onLogin={onLogin}
        onLogout={onLogout}
        onRegister={onRegister}
        onGenerateImages={onGenerateImages}
        onViewSavedImages={onViewSavedImages}
      />
      {showLoginBox && <LoginBox setLoggedIn={setLoggedIn} />}
      {loggedIn && showLyricsBox && <LyricsBox />}
      <MenuBar onToggleBoxes={() => setShowBoxes(!showBoxes)} />
      <BackgroundSlideshow images={images} />
      <div className="login-container">
        {showBoxes && !loggedIn && (
          <>
            <LoginBox setLoggedIn={setLoggedIn} setCurrentUser={setCurrentUser} />
          </>
        )}
        {showBoxes && loggedIn && showLyricsBox && (
          <>
            <LyricsBox loggedIn={loggedIn} setGeneratedImageUrls={setGeneratedImageUrls} currentUser={currentUser}  />
          </>
        )}
        {showBoxes && loggedIn && showSavedImages && (
          <>
          <SavedImagesBox savedImages={savedImages} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
