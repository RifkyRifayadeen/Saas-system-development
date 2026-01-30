const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.getPlans = async (req, res) => {
    try {
        // Mock plans usually come from DB or Stripe Cache
        const plans = [
            { id: 'price_basic', name: 'Basic', price: 0, features: ['Unlimited Tasks', '1 Project'] },
            { id: 'price_pro', name: 'Pro', price: 10, features: ['Unlimited Projects', 'Analytics'] },
        ];
        // In real app: const plans = await db.query('SELECT * FROM plans');
        res.json(plans);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
};

exports.subscribe = async (req, res) => {
    try {
        const { planId, paymentMethodId } = req.body;
        const userId = req.user.id;

        // 1. In real app, call Stripe API here to create subscription

        // 2. Update local DB
        const newSubscriptionId = uuidv4();
        // Assuming we have a subscriptions table
        // const sub = await db.query('INSERT INTO subscriptions ...')

        res.json({ message: `Successfully subscribed to ${planId}`, subscriptionId: newSubscriptionId });
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
};

exports.getStatus = async (req, res) => {
    try {
        // Mock status
        const userId = req.user.id;
        // const sub = await db.query('SELECT * FROM subscriptions WHERE user_id = $1', [userId]);
        res.json({
            status: 'active',
            plan: 'Pro',
            validUntil: new Date(new Date().setMonth(new Date().getMonth() + 1))
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
};
