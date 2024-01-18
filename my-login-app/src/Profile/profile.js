// // ProfilePage.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {Navigate,useNavigate} from 'react-router-dom'


// const ProfilePage = async () => {
//   const [email, setEmail] = useState({});
//   const [name, setName] = useState({});
//   const [profilePicture, setProfilePicture] = useState(null);
//   const token = localStorage.getItem('token');

//   const navigate = useNavigate();

//   if(token){
//     navigate('/login')
//   }
//   // else{
//     // useEffect(async () => {
//       // Fetch user details from the backend when the component mounts
//       const response = await fetch('http://localhost:3000/api/auth/profile', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//       });
//       console.log("rESPONSE=====================",response)
//       const fetchUserDetails = async () => {
//         try {
//           setEmail(response.data.email);
//           setName(response.data.name)
//         } catch (error) {
//           console.error('Error fetching user details:', error);
//         }
//       };
  
  
//       await fetchUserDetails();
//     // }, []);
//   // }

//   const handleProfilePictureChange = (e) => {
//     // Handle profile picture upload
//     const file = e.target.files[0];
//     setProfilePicture(file);
//   };

//   const handleUpdateProfile = async () => {
//     // Update user details and upload profile picture to the backend
//     const formData = new FormData();
//     formData.append('profilePicture', profilePicture);
//     // formData.append('otherUserData', JSON.stringify(userDetails));

//     try {
//       await axios.post('http://localhost:3000/api/auth/updateProfile', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       alert('Profile updated successfully');
//     } catch (error) {
//       console.error('Error updating profile:', error);
//     }
//   };

//   return (
//     <center>
//     <div>
//       <h2>User Details</h2>
//       <div>
//         <p>Name: ${name} </p>
//         <p>Email:${email} </p>
//         {/* Display other user details as needed */}
//       </div>
//       <div>
//         <h3>Profile Picture</h3>
//         <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
//         <button onClick={handleUpdateProfile}>Update Profile</button>
//       </div>
//     </div>
//     </center>
//   );
// };

// export default ProfilePage;


// ProfilePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          // Redirect to login if there is no token
          navigate('/login');
        } else {
          const response = await fetch('http://localhost:3000/api/auth/profile', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setEmail(data.email);
            setName(data.name);
          } else {
            // Handle error response from the server
            console.error('Error fetching user details:', response.status);
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleProfilePictureChange = (e) => {
    // Handle profile picture upload
    const file = e.target.files[0];
    setProfilePicture(file);
  };

  const handleUpdateProfile = async () => {
    // Update user details and upload profile picture to the backend
    const formData = new FormData();
    formData.append('profilePicture', profilePicture);

    try {
      await axios.post('http://localhost:3000/api/auth/updateProfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <center>
      <div>
        <h2>User Details</h2>
        <div>
          <p>Name: {name} </p>
          <p>Email: {email} </p>
          {/* Display other user details as needed */}
        </div>
        <div>
          <h3>Profile Picture</h3>
          <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
          <button onClick={handleUpdateProfile}>Update Profile</button>
        </div>
      </div>
    </center>
  );
};

export default ProfilePage;
