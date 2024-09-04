const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    const token = req.cookies['jwt']; // Ensure the cookie name matches what you set on the client-side

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        // Verify the token
        const data = jwt.verify(token, process.env.JWT_KEY);

        // Find the user associated with the token
        const user = await User.findOne({ userName: data.userName });

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        // Attach user to request object
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        console.error('JWT verification error:', err);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
}

module.exports = {
    auth
}
