const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();

app.use(cors({
    origin: process.env.CLIENT_PORT, 
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
    }
}));

const url = process.env.CONNECTION_URL ;
mongoose.connect(url);
const con = mongoose.connection;

con.on('open', () => {
    console.log('Connected to Database...!');
   
});

app.use('/user', require('./Routers/Users'));
app.use('/property', require('./Routers/Properties'));
app.use('/booking',require('./Routers/Booking'));

app.listen(4000, () => {
    console.log('Server running on port 4000');
});

