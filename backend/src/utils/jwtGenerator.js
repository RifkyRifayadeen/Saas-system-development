const jwt = require('jsonwebtoken');
require('dotenv').config();

function generatejwt(user_id, role) {
    const payload = {
        user: {
            id: user_id,
            role: role
        }
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'secret777', { expiresIn: '1h' });
}

module.exports = generatejwt;
