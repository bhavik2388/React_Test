// Home.js
import React from 'react';
// import Signup from './signup';
import { Link } from 'react-router-dom';


const Home = () => {
  return (
    <div>
    <center>
      <h2>Welcome to the Home Page!</h2>
      <p>This is the main page of your React app.</p>
        <Link to="/signup"> 
        <button>SIGNUP</button></Link>
        <br/>
        <br/>
    <Link to="/login"> 
        <button>LOGIN</button>
    </Link>



    </center>
    </div>
  );
};

export default Home;
