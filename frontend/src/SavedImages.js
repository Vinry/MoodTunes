import React, { useEffect, useState } from 'react';
import api from './Api';

function SavedImages({ username }) {
  const [savedImages, setSavedImages] = useState([]);

  useEffect(() => {
    const fetchSavedImages = async () => {
      const images = await api.getSavedImages(username);
      setSavedImages(images);
    };

    fetchSavedImages();
  }, [username]);

  return (
    <div className="saved-images">
      {savedImages.map((image, index) => (
        <img key={index} src={image} alt="Saved artwork" />
      ))}
    </div>
  );
}

export default SavedImages;
