import React from 'react';
import LoginBox from './LoginBox';
import BackgroundSlideshow from './BackgroundSlideshow';
import './App.css';

function App() {
  return (
    <div className="app">
      <BackgroundSlideshow />
      <div className="login-container">
        <LoginBox />
      </div>
    </div>
  );
}

export default App;
