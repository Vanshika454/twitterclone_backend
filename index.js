const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const cors = require('cors');
require('dotenv').config();

//routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const tweetRoutes = require('./routes/tweetRoutes');

//constants
const port = 3033;

//inits
const app = express();

const connectToMongo = async () => {
    try {
        mongoose.connect(process.env.MONGOURI);
    } catch (error) {
        console.log('Mongo connection Error', error);
    }
}
connectToMongo();
mongoose.connection.once('open', () => console.log("Connected to MongoDB"));

//setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
}));
app.use(cookieParser({}));
app.use((req, res, next) => {
    //for cookies
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND);
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, *');
    next();
});

//routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/tweet', tweetRoutes);
app.use('/images', express.static('images'));

app.get('/', (req, res) => {
    res.send('Hello World');  
});

app.listen(port, () => console.log(`Server is running on localhost: ${port}`))

