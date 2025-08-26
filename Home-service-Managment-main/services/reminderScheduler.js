const cron = require('node-cron');
const ServiceRequest = require('../model/ServiceRequest');
const { sendServiceReminder } = require('./emailService');

// Check for upcoming services every 30 minutes
const scheduleReminderChecks = () => {
  console.log('Starting reminder scheduler...');
  
  // Run every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log('Checking for upcoming services to send reminders...');
    await checkAndSendReminders();
  });
  
  // Also run immediately on startup
  setTimeout(() => {
    checkAndSendReminders();
  }, 5000); // Wait 5 seconds after startup
};

// Check for services that need reminders (1 hour before scheduled time)
const checkAndSendReminders = async () => {
  try {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + (60 * 60 * 1000)); // 1 hour from now
    const twoHoursFromNow = new Date(now.getTime() + (2 * 60 * 60 * 1000)); // 2 hours from now
    
    // Find services scheduled between 1-2 hours from now that haven't had reminders sent
    const upcomingServices = await ServiceRequest.find({
      scheduledTime: {
        $gte: oneHourFromNow,
        $lte: twoHoursFromNow
      },
      reminderSent: false,
      status: { $in: ['pending', 'in-progress'] }
    });

    console.log(`Found ${upcomingServices.length} services needing reminders`);

    for (const service of upcomingServices) {
      try {
        const result = await sendServiceReminder(
          service.customerEmail,
          service.customerName,
          service.serviceType,
          service.scheduledTime,
          service.providerId
        );

        if (result.success) {
          // Mark reminder as sent
          await ServiceRequest.findByIdAndUpdate(service._id, {
            reminderSent: true
          });
          
          console.log(`Reminder sent for service ${service._id} to ${service.customerEmail}`);
        } else {
          console.error(`Failed to send reminder for service ${service._id}:`, result.error);
        }
      } catch (error) {
        console.error(`Error processing reminder for service ${service._id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in checkAndSendReminders:', error);
  }
};

// Manual function to send reminder for a specific service
const sendReminderForService = async (serviceId) => {
  try {
    const service = await ServiceRequest.findById(serviceId);
    
    if (!service) {
      return { success: false, error: 'Service not found' };
    }
    
    if (service.reminderSent) {
      return { success: false, error: 'Reminder already sent for this service' };
    }
    
    const result = await sendServiceReminder(
      service.customerEmail,
      service.customerName,
      service.serviceType,
      service.scheduledTime,
      service.providerId
    );
    
    if (result.success) {
      await ServiceRequest.findByIdAndUpdate(serviceId, {
        reminderSent: true
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error sending manual reminder:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  scheduleReminderChecks,
  checkAndSendReminders,
  sendReminderForService
};
