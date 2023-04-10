import React from 'react';
import './LoginBox.css';

function LoginBox() {
  const handleLogin = (event) => {
    event.preventDefault();
    window.location.href = 'http://localhost:3001/auth/spotify';
  };

  return (
    <div className="login-box">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-box">
          <input type="text" placeholder="Username" />
        </div>
        <div className="input-box">
          <input type="password" placeholder="Password" />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginBox;
