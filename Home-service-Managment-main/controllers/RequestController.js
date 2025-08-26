const ServiceRequest = require('../model/ServiceRequest');
const Service = require('../model/ServiceSchema');
const User = require('../model/UserSchema');
const { sendServiceConfirmation } = require('../services/emailService');
const { sendReminderForService } = require('../services/reminderScheduler');

// Create a new service request
const createServiceRequest = async (req, res) => {
  try {
    const { customerName, customerEmail, serviceType, scheduledTime, notes } = req.body;
    const { providerId } = req.params;

    // Validate required fields
    if (!customerEmail || !scheduledTime) {
      return res.status(400).json({
        success: false,
        message: 'Customer email and scheduled time are required'
      });
    }

    // Validate scheduled time is in the future
    const scheduledDate = new Date(scheduledTime);
    if (scheduledDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Scheduled time must be in the future'
      });
    }

    // Check if provider exists and is available
    const provider = await Service.findOne({ id: parseInt(providerId) });
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Service provider not found'
      });
    }

    // Check availability - if "no", don't create request
    if (provider.availability.toLowerCase() === 'no') {
      return res.status(400).json({
        success: false,
        message: 'Service provider is not available at the moment'
      });
    }

    // Create new service request
    const newRequest = new ServiceRequest({
      customerName,
      customerEmail,
      providerId: parseInt(providerId),
      serviceType,
      scheduledTime: scheduledDate,
      notes,
      status: 'pending',
      startTime: new Date()
    });

    const savedRequest = await newRequest.save();

    // Send confirmation email
    try {
      await sendServiceConfirmation(
        customerEmail,
        customerName,
        serviceType,
        scheduledDate,
        parseInt(providerId)
      );
      console.log(`Confirmation email sent to ${customerEmail}`);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Service request created successfully',
      data: savedRequest
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating service request',
      error: error.message
    });
  }
};

// Update service request status
const updateServiceRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, notes } = req.body;

    const request = await ServiceRequest.findOne({ _id: requestId });
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    // Update request
    request.status = status || request.status;
    request.notes = notes || request.notes;

    // If status is completed, set end time and save to user schema
    if (status === 'completed') {
      request.endTime = new Date();
      
      // Find or create user and add to service history
      let user = await User.findOne({ name: request.customerName });
      
      if (!user) {
        // If user doesn't exist, create a basic entry (you might want to handle this differently)
        user = new User({
          name: request.customerName,
          contact: 'N/A', // You might want to collect this during request creation
          address: 'N/A', // You might want to collect this during request creation
          serviceHistory: []
        });
      }

      // Add completed request to user's service history
      user.serviceHistory.push({
        requestId: request._id,
        serviceType: request.serviceType,
        providerId: request.providerId,
        completedAt: request.endTime,
        notes: request.notes
      });

      await user.save();
    }

    const updatedRequest = await request.save();

    res.status(200).json({
      success: true,
      message: 'Service request updated successfully',
      data: updatedRequest
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating service request',
      error: error.message
    });
  }
};

// Get all service requests
const getAllServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      message: 'Service requests retrieved successfully',
      data: requests
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving service requests',
      error: error.message
    });
  }
};

// Get active service requests (pending and in-progress)
const getActiveServiceRequests = async (req, res) => {
  try {
    const activeRequests = await ServiceRequest.find({
      status: { $in: ['pending', 'in-progress'] }
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      message: 'Active service requests retrieved successfully',
      data: activeRequests
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving active service requests',
      error: error.message
    });
  }
};

// Get completed service requests
const getCompletedServiceRequests = async (req, res) => {
  try {
    const completedRequests = await ServiceRequest.find({
      status: 'completed'
    }).sort({ endTime: -1 });
    
    res.status(200).json({
      success: true,
      message: 'Completed service requests retrieved successfully',
      data: completedRequests
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving completed service requests',
      error: error.message
    });
  }
};

// Get service requests by provider ID
const getServiceRequestsByProvider = async (req, res) => {
  try {
    const { providerId } = req.params;
    
    const requests = await ServiceRequest.find({
      providerId: parseInt(providerId)
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      message: 'Provider service requests retrieved successfully',
      data: requests
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving provider service requests',
      error: error.message
    });
  }
};

// Get service requests by customer name
const getServiceRequestsByCustomer = async (req, res) => {
  try {
    const { customerName } = req.params;
    
    const requests = await ServiceRequest.find({
      customerName: customerName
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      message: 'Customer service requests retrieved successfully',
      data: requests
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving customer service requests',
      error: error.message
    });
  }
};

// Send manual reminder for a service
const sendManualReminder = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    const result = await sendReminderForService(requestId);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Reminder sent successfully',
        data: { messageId: result.messageId }
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending reminder',
      error: error.message
    });
  }
};

module.exports = {
  createServiceRequest,
  updateServiceRequest,
  getAllServiceRequests,
  getActiveServiceRequests,
  getCompletedServiceRequests,
  getServiceRequestsByProvider,
  getServiceRequestsByCustomer,
  sendManualReminder
};