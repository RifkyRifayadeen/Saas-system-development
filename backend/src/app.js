const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
// const adminRoutes = require('./routes/adminRoutes'); // To be implemented

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/resources', resourceRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);
// app.use('/api/v1/admin', adminRoutes);

// Health Check
app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'TaskFlow API is running' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

module.exports = app;
