import React, { useState } from 'react';
import api from './Api';
import './LoginBox.css';

function LoginBox({ setLoggedIn, setCurrentUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  //const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    const user = await api.loginUser(username, password);
    if (user) {
      console.log('User logged in successfully');
      setLoggedIn(true);
      setCurrentUser(username);  // Set current user
      console.log(username);
    } else {
      console.error('Error logging in');
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const user = await api.registerUser(username, password);
    if (user) {
      console.log('User registered successfully');
    } else {
      console.error('Error registering');
    }
  };

  return (
    <div className="login-box">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={isLogin ? handleLogin : handleRegister}>
        <div className="input-box">
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="input-box">
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Switch to Register' : 'Switch to Login'}</button>
    </div>
  );
}

export default LoginBox;
