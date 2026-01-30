const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwtGenerator = require('../utils/jwtGenerator');
const { v4: uuidv4 } = require('uuid');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Destructure the req.body (name, email, password)

        // 2. Check if user exists (if user exist then throw error)
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length > 0) {
            return res.status(401).json({ message: 'User already exists!' });
        }

        // 3. Bcrypt the user password
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);

        // 4. Enter the new user inside our database
        const newId = uuidv4();
        const newUser = await db.query(
            'INSERT INTO users (id, full_name, email, password_hash, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
            [newId, name, email, bcryptPassword]
        );

        // 5. Generating our jwt token
        const token = jwtGenerator(newUser.rows[0].id, 'user'); // Default role 'user'

        res.status(201).json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user doesn't exist (if not then we throw error)
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(401).json({ message: 'Password or Email is incorrect' });
        }

        // 2. Compare incoming password with hashed password
        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);

        if (!validPassword) {
            return res.status(401).json({ message: 'Password or Email is incorrect' });
        }

        // 3. Give them the jwt token
        const token = jwtGenerator(user.rows[0].id, user.rows[0].role || 'user');

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
