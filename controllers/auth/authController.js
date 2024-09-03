const User = require('../../models/User');
const validateRequest = require('./services/validate-request');
const passwordManager = require('./services/password-manager');
const { createToken } = require('./services/create-token'); 

//Creating  User
module.exports.registerUser = async (req, res) => {
    const { name, userName, email, password } = req.body;

    try {
        validateRequest.validateRegister(name, userName, email, password);
    } catch (error) {
        res.status(400).send(error.message);
        return;
    }
    

    try {
        let existingUserName = await User.findOne({ userName });
        if(existingUserName) {
            res.status(400).send('Existing Username!');
            return;
        }

        let existingUserEmail = await User.findOne({ email });
        if(existingUserEmail) {
            res.status(400).send('Existing Email!');
            return;
        }

        const hashedPW = await passwordManager.toHash(password);
        await User.create({
            name, userName, email, password: hashedPW
        });

        res.status(200).send({ message: 'User created succefully...!!!' });

    } catch (error) {
        res.status(500).send('Something went wrong!');
    }
}

// Log In User
module.exports.loginUser = async (req, res) => {
    const { userName, password } = req.body;

    try {
        validateRequest.validateLogIn(userName, password);
    } catch (error) {
        res.status(400).send(error.message);
        return;
    }

    try {
        const user = await User.findOne({ userName });
        if (!user) {
            res.status(401).send('User does not exist!');
            return;
        }
        
        const isPasswordCorrect = passwordManager.compare(password, user.password);
        if (isPasswordCorrect) {
            const token = createToken(user._id, user.userName, user.email);
            const { password, ...userWithoutPassword } = user.toObject();

            res
                .status(200)
                .cookie('jwt', token)
                .cookie('userId', `${user._id.toString()}`)
                .send({
                    message: 'Logged in successfully',
                    user: userWithoutPassword
                });
        } else {
            res.status(401).send('Password is incorrect');
        }
    } catch(err) {
        res.status(500).send('Something went wrong!');
    }
};