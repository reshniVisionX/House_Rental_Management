const express = require('express');
const router = express.Router();
const User = require('../Models/Users')
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser')
router.use(cookieParser());
const mongoose = require('mongoose');


router.use(cors());
router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

router.post('/register', async (req, res) => {
  const { name, email, password, mobile } = req.body;

  try {
    if (!email || !password || !mobile) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    console.log(req.body);
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      console.log(existingUser);
      return res.status(400).json({ Status: 'failure', message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, mobile });

    await newUser.save();

    console.log('User registered successfully in DB');

    res.json({ Status: 'success' });

  } catch (error) {
    
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to register user', message: 'Failed to Register' });
  }
});


  
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      console.log(user);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
     
      req.session.userData = { name: user.name, email: user.email };
      res.cookie('userData', { name: user.name, email: user.email }, { httpOnly: true });
  
      res.json({ message: 'Login successful', login: true }); 
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ error: 'Failed to login' });
    }
  });
  
  router.post('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
        res.status(500).json({ success: false, error: 'Failed to logout' }); 
      } else {
        res.clearCookie('connect.sid'); 
        res.clearCookie('userData');   
        res.json({ success: true });
      }
    });
  });
  
 
  router.get('/userData', (req, res) => {
    const connectSid = req.cookies['connect.sid'];
    const userDataCookie = req.cookies['userData'];
    if (!connectSid || !userDataCookie) {
      return res.status(401).json({ name: null, email: null, message: 'User not authenticated' });
    }
    try {
      console.log('connect.sid:', connectSid);
      console.log('userData:', userDataCookie);
      const userData = userDataCookie;
      res.json({ name: userData.name, email: userData.email });
    } catch (error) {
      console.error('Error parsing user data:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.get('/getId/:email', async (req, res) => {
    try {
      const emailId=req.params.email;
      console.log("Finding",emailId)
        const user = await User.findOne({ email: emailId });
        if (!user) {
            return res.status(404).json({ message: "User id not found" });
        }
       
        res.json({ userId: user._id });
    } catch (error) {
        console.error('Error fetching user by email:', error);
        res.status(500).json({ message: "Server error" });
    }
});

 router.get('/getUserById/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId);
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid User ID format' });
    }

    const userIdObject = new mongoose.Types.ObjectId(userId);
    const user = await User.findById(userIdObject);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log("Sending user",user);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


  router.get('/',(req,res)=>{
    const userDataCookie = req.cookies['userData'];
          if(userDataCookie){
           res.json({valid:true, name:req.session.name,email:req.session.email});
          }else{
            res.json({valid:false});
          }
  })
  
  module.exports = router;
  