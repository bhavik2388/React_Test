const { MongoClient,ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = 'jwtsecretkey';
const path = require('path')
const mongoURI = 'mongodb+srv://bhavik:test@cluster0.s64ea.mongodb.net/';
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const fs = require('fs');


async function login(req, res) {
  try {
    await client.connect();
    const database = client.db('reactTest');
    const collection = database.collection('user');

    const { email, password } = req.body;
    const user = await collection.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.setHeader('Cache-Control', 'no-store');
    let token;
    try {
      // Creating jwt token
      token = jwt.sign({ payload: user._id }, secretKey, { expiresIn: '5m' });
    } catch (err) {
      console.log(err);
      const error = new Error('Error! Something went wrong.');
      return error;
    }

    return res.json({ message: 'Login successful', data: { token: token } });
  } finally {
    await client.close();
  }
}

async function signup(req, res) {
  try {
    await client.connect();
    const database = client.db('reactTest');
    const collection = database.collection('user');

    const { email, password, firstName, lastName, number, age } = req.body;

    const name = firstName + ' ' + lastName;
    const existingUser = await collection.findOne({ email });

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = {
      email,
      hashedPassword, // You should hash the password before storing it in production
      name,
      number,
      age,
    };

    const result = await collection.insertOne(newUser);
    res.json({ message: 'You have signed up.' });
  } finally {
    await client.close();
  }
}

async function getUserDetails(req, res){
    try {
        await client.connect();
        const database = client.db('reactTest');
        const collection = database.collection('user');

        let token = req.headers.authorization;
        
        if (!token) {
          return res.status(401).json({ message: 'Unauthorized: Token not provided' });
        }
        
        token = token.slice(7);
        console.log(token)
        const decoded = jwt.verify(token, secretKey);
        console.log(decoded)
        // req.user = decoded;

        // let userId = req.query.userId;
        let documentId = decoded.payload;  
        const query = { _id: new ObjectId(documentId) };
        const result = await collection.findOne(query);
        console.log(result)
        res.status(200).json(result);
    }finally {
        await client.close();
      }

}

const userDatabase = {};

async function profilePicture(req,res) {
    try {
        console.log("IN")
        // Parse other user data from the request body
        //const otherUserData = JSON.parse(req.body.profilePicture);
         // Get the uploaded profile picture
    
        // Get the uploaded profile picture
        const profilePicture = req.file;

        // Specify the directory where you want to save the file
        const saveDirectory = path.resolve(__dirname, '../image'); 
    
        // Create a unique filename for the uploaded file
        const uniqueFilename = `${Date.now()}${path.extname(profilePicture.originalname)}`;
    
        // Combine the directory and filename to get the complete path
        const profilePicturePath = path.join(saveDirectory, uniqueFilename);
    
        // Save the file to the specified directory
        fs.writeFileSync(profilePicturePath, profilePicture.buffer);
    
        // Update user profile using the controller
      //  profileController.updateProfile(userId, otherUserData, profilePicturePath);
        res.status(200).json({ message: 'Profile updated successfully' });
      } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }   
}

module.exports = { login, signup, profilePicture, getUserDetails};
