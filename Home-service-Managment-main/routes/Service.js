//similar to user all routes function will be handled in controllers

const router = require('express').Router();
const serviceController = require('../controllers/ServiceController');

router.route('/')
.get(serviceController.getAllServices)
.post(serviceController.createService);

router.route('/:id')
.get(serviceController.getService)
.put(serviceController.updateService)
.delete(serviceController.deleteService);

module.exports = router;