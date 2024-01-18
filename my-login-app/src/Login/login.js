// src/Login.js
import React, { useState } from 'react';
import './login.css'
import { NavLink } from 'react-router-dom';
import {Navigate,useNavigate} from 'react-router-dom'
import { useHistory } from 'react-router-dom';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 // const history = useHistory();

 const navigate = useNavigate();
  let token;
 // bhavikpaun18@gmail.com  
    //  Bhavik@85308
   
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token',data.data.token)
      console.log('Login successful:', data);
      token = data.data.token;

      if (token) {
        console.log("IN")
        // Navigate to the profile page after successful login
        navigate('/profile');
      }
     //   history.push('/profile');
    } catch (error) {
      console.error('Error during login:', error.message);
    }
  };

  return (
    <div><center>
    {token ? <Navigate to = {'/profile'} /> : console.log(token,"TOKEN")}
      <h2>Login</h2>
      <label>Email:</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <br />
      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <br />
      <button onClick={handleLogin}>Login</button>
      {/* <NavLink to="/profile">Go to Dashboard</NavLink>   */}
      </center></div>
  );
};

export default Login;
