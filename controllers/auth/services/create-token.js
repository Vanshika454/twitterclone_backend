const jwt = require('jsonwebtoken');

const createToken = (userId, userName, email) => {
    const token = jwt.sign({
        userId,
        userName, 
        email
    }, process.env.JWT_KEY, {
        expiresIn: '24h'
    });

    return token;
}

module.exports = {
    createToken
};