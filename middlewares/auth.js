const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    const token = req.cookies['jwt'];
    if (!token) {
        res.status(401).send('Unauthorized!!');
        return;
    }

    try {
        const data = jwt.verify(token, process.env.JWT_KEY);

        const user = await User.findOne({ userName: data.userName });
        if(!user) {
            res.status(401).send('Unauthorized!!');
            return;
        }

        req.user = user;
    } catch (err) {
        res.status(401).send('Unauthorized!!');
    }

    next();
}

module.exports = {
    auth
}