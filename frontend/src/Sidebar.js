import React from 'react';

function Sidebar({ isOpen, toggle, onLogin, onLogout, onRegister, onGenerateImages, onViewSavedImages }) {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`} onClick={toggle}>
      <ul>
        <li>
          <button onClick={onLogin}>Login</button>
        </li>
        <li>
          <button onClick={onRegister}>Register</button>
        </li>
        <li>
          <button onClick={onLogout}>Logout</button>
        </li>
        <li>
          <button onClick={onGenerateImages}>Generate Images</button>
        </li>
        <li>
          <button onClick={onViewSavedImages}>My Saved Images</button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
