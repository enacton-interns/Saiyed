//Now for request

const router = require('express').Router();
const requestController = require('../controllers/RequestController');

// Get all service requests
router.route('/')
  .get(requestController.getAllServiceRequests);

// Get active requests
router.route('/active')
  .get(requestController.getActiveServiceRequests);

// Get completed requests
router.route('/completed')
  .get(requestController.getCompletedServiceRequests);

// Get requests by provider
router.route('/provider/:providerId')
  .get(requestController.getServiceRequestsByProvider);

// Get requests by customer
router.route('/customer/:customerName')
  .get(requestController.getServiceRequestsByCustomer);

// Create request with provider ID in params
router.route('/:providerId')
  .post(requestController.createServiceRequest);

// Update request by request ID
router.route('/update/:requestId')
  .put(requestController.updateServiceRequest);

// Send manual reminder for a request
router.route('/reminder/:requestId')
  .post(requestController.sendManualReminder);

module.exports = router;