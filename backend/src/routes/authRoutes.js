const router = require('express').Router();
const authController = require('../controllers/authController');
const authorization = require('../middleware/authMiddleware');

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Verify (check if token is valid) - Optional helper
router.get('/is-verify', authorization, async (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
