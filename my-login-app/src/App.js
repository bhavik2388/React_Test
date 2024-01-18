// // src/App.js
// import React from 'react';
// import Login from '../src/login';

// function App() {
//   return (
//     <div className="App">
//       <Login />
//     </div>
//   );
// }

// export default App;


// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home/home';
import Signup from './Signup/signup';
import Login from './Login/login';
import Profile from './Profile/profile';
import  ProtectedRoute  from './protectedRoute';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
           
        <Route path="/" element={<Home/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/login" element={<Login/>} />
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
