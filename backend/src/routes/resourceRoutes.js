const router = require('express').Router();
const resourceController = require('../controllers/resourceController');
const authorization = require('../middleware/authMiddleware');

// All resource routes are protected
router.use(authorization);

router.post('/', resourceController.createResource);
router.get('/', resourceController.getAllResources);
router.get('/:id', resourceController.getResourceById);
router.put('/:id', resourceController.updateResource);
router.delete('/:id', resourceController.deleteResource);

module.exports = router;
