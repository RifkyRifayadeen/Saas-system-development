const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Create Resource (Project)
exports.createResource = async (req, res) => {
    try {
        const { name, description, priority, status } = req.body;
        const ownerId = req.user.id;
        const newId = uuidv4();

        const newResource = await db.query(
            'INSERT INTO resources (id, owner_id, name, description, status, priority, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *',
            [newId, ownerId, name, description, status || 'planned', priority || 'medium']
        );

        res.status(201).json(newResource.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
};

// Get All Resources (for the logged in user)
exports.getAllResources = async (req, res) => {
    try {
        // Pagination params
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const resources = await db.query(
            'SELECT * FROM resources WHERE owner_id = $1 LIMIT $2 OFFSET $3',
            [req.user.id, limit, offset]
        );

        res.json(resources.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
};

// Get Single Resource
exports.getResourceById = async (req, res) => {
    try {
        const { id } = req.params;
        const resource = await db.query('SELECT * FROM resources WHERE id = $1 AND owner_id = $2', [
            id,
            req.user.id
        ]);

        if (resource.rows.length === 0) {
            return res.status(404).json('Resource not found');
        }

        res.json(resource.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
};

// Update Resource
exports.updateResource = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, status, priority } = req.body;

        const updateResource = await db.query(
            'UPDATE resources SET name = $1, description = $2, status = $3, priority = $4 WHERE id = $5 AND owner_id = $6 RETURNING *',
            [name, description, status, priority, id, req.user.id]
        );

        if (updateResource.rows.length === 0) {
            return res.status(404).json('Resource not found or unauthorized');
        }

        res.json(updateResource.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
};

// Delete Resource
exports.deleteResource = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteResource = await db.query(
            'DELETE FROM resources WHERE id = $1 AND owner_id = $2 RETURNING *',
            [id, req.user.id]
        );

        if (deleteResource.rows.length === 0) {
            return res.status(404).json('Resource not found or unauthorized');
        }

        res.json('Resource deleted');
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
};
