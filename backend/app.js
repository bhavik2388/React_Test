// const express = require('express');
// const { MongoClient } = require('mongodb');
// const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt');
// var cors = require("cors");
// const jwt = require("jsonwebtoken");
// const secretKey = "jwtsecretkey";


// const app = express();
// const port = process.env.PORT || 3000;
// app.use(cors());


// app.use(bodyParser.json());

// const mongoURI = 'mongodb+srv://bhavik:test@cluster0.s64ea.mongodb.net/';
// const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
// "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiNjVhNjc4Y2Q1ZTU5NGU3Zjk1Nzk2YzJhIiwiaWF0IjoxNzA1NTU1OTA2LCJleHAiOjE3MDU1NTYwMjZ9.RCMTgzIMXrKi1BvXQmgqi0Mj8-pK87TE7pC3N2ZuvL4"

// app.post('/profile',async(req,res) => {
//   await client.connect();
//   const database = client.db('reactTest');
//   const collection = database.collection('user');

 
// })

// app.post('/login', async (req, res) => {
//     try {
//         await client.connect();
//         const database = client.db('reactTest');
//         const collection = database.collection('user');

//         const { email, password} = req.body;
//         const user = await collection.findOne({ email });
//         console.log(user)

//         if (!user) {
//           return res.status(401).json({ message: 'Invalid email or password' });
//         }
    
//         const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    
//         if (!isPasswordValid) {
//           return res.status(401).json({ message: 'Invalid email or password' });
//         }
//         res.setHeader('Cache-Control', 'no-store');
//         let token;
//         try {
//             //Creating jwt token
//             token = jwt.sign({payload:user._id} , secretKey,{ expiresIn: "1h"});
//         } catch (err) {
//             console.log(err);
//             const error = new Error("Error! Something went wrong.");
//             return (error);
//         }
        
//         return res.json({ message: 'Login successful' ,data:{token:token}});

//     } finally {
//         await client.close();
//     }
  
// })


// app.post('/signup', async (req, res) => {
//   try {

//     await client.connect();
//     const database = client.db('reactTest');
//     const collection = database.collection('user');

//     // Assuming your signup form has fields like username, email, and password
//     const {  email, password, firstName, lastName, number, age } = req.body;

//     const name = firstName + " " + lastName
//     const existingUser = await collection.findOne({ email });

//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     if (existingUser) {
//       return res.status(400).json({ message: 'Email already exists' });
//     }

//     const newUser = {
//       email,
//       hashedPassword, // You should hash the password before storing it in production
//       name,
//       number,
//       age
//     };

//     const result = await collection.insertOne(newUser);
//     res.json({message:"You have signed up."});
//   } finally {
//     await client.close();
//   }
// });


// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Routes
const authRoutes = require('./Routes/authRoutes');
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
