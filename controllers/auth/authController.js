const User = require('../../models/User');
const validateRequest = require('./services/validate-request');
const passwordManager = require('./services/password-manager');
const { createToken } = require('./services/create-token'); 

module.exports.registerUser = async (req, res) => {
    const { name, userName, email, password } = req.body;

    // Validate request data
    try {
        validateRequest.validateRegister(name, userName, email, password);
    } catch (error) {
        return res.status(400).send(error.message);
    }

    try {
        // Check for existing username
        const existingUserName = await User.findOne({ userName });
        if (existingUserName) {
            return res.status(400).send('Username already exists');
        }

        // Check for existing email
        const existingUserEmail = await User.findOne({ email });
        if (existingUserEmail) {
            return res.status(400).send('Email already exists');
        }

        // Hash password and create new user
        const hashedPW = await passwordManager.toHash(password);
        const newUser = new User({ name, userName, email, password: hashedPW });
        await newUser.save();

        res.status(201).send({ message: 'User created successfully' });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).send('Internal server error');
    }
};

module.exports.loginUser = async (req, res) => {
    const { userName, password } = req.body;

    // Validate request data
    try {
        validateRequest.validateLogIn(userName, password);
    } catch (error) {
        return res.status(400).send(error.message);
    }

    try {
        // Find user by username
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(401).send('User does not exist');
        }
        
        // Compare passwords
        const isPasswordCorrect = await passwordManager.compare(password, user.password);
        if (isPasswordCorrect) {
            // Create token and respond
            const token = createToken(user._id, user.userName, user.email);
            const { password, ...userWithoutPassword } = user.toObject();

            res
                .status(200)
                .cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
                .cookie('userId', user._id.toString(), { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
                .send({
                    message: 'Logged in successfully',
                    user: userWithoutPassword
                });
        } else {
            res.status(401).send('Incorrect password');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Internal server error');
    }
};
