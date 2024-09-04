const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

// routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const tweetRoutes = require('./routes/tweetRoutes');

// constants
const port = process.env.PORT || 3033;

// inits
const app = express();

const connectToMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGOURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.log('Mongo connection Error', error);
    }
}
connectToMongo();
mongoose.connection.once('open', () => console.log("Connected to MongoDB"));

// setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup
app.use(cors({
    origin: process.env.FRONTEND || 'http://localhost:3000', // Fallback for local development
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
}));

app.use(cookieParser());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/tweet', tweetRoutes);
app.use('/images', express.static('images'));

app.get('/', (req, res) => {
    res.send('Hello World');  
});

app.listen(port, () => console.log(`Server is running on port: ${port}`));


