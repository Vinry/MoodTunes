import React from 'react';

const MenuBar = ({ onToggleBoxes }) => {
  return (
    <div className="menu-bar">
      <button onClick={onToggleBoxes}>Toggle Login & Lyrics Input</button>
      {/* Add more menu options here */}
    </div>
  );
};

export default MenuBar;
