import React from 'react';

function SavedImagesBox({ savedImages }) {
    console.log(savedImages);

  return (
    <div className="saved-images-box">
      <h2>Saved Images</h2>
      {savedImages.map((imagedata, index) => (
        <div key={index}>
          <img src={imagedata} alt={`Saved image ${index + 1}`} />
        </div>
      ))}
    </div>
  );
}

export default SavedImagesBox;
