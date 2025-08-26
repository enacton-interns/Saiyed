const nodemailer = require('nodemailer');

// Email configuration - you'll need to set these environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your preferred email service
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com', // Set this in environment variables
    pass: process.env.EMAIL_PASS || 'your-app-password'     // Set this in environment variables
  }
});

// Send service reminder email
const sendServiceReminder = async (customerEmail, customerName, serviceType, scheduledTime, providerId) => {
  try {
    const formattedTime = new Date(scheduledTime).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: customerEmail,
      subject: `Service Reminder - ${serviceType} Scheduled`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Service Reminder</h2>
          
          <p>Dear ${customerName},</p>
          
          <p>This is a friendly reminder that your <strong>${serviceType}</strong> service is scheduled for:</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; font-size: 16px;"><strong>📅 Date & Time:</strong> ${formattedTime}</p>
            <p style="margin: 5px 0 0 0;"><strong>🔧 Service:</strong> ${serviceType}</p>
            <p style="margin: 5px 0 0 0;"><strong>👨‍🔧 Provider ID:</strong> ${providerId}</p>
          </div>
          
          <p>Please ensure someone is available at the scheduled time. If you need to reschedule, please contact us as soon as possible.</p>
          
          <p>Thank you for choosing our home service management system!</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated reminder. Please do not reply to this email.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Reminder email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('Error sending reminder email:', error);
    return { success: false, error: error.message };
  }
};

// Send service confirmation email
const sendServiceConfirmation = async (customerEmail, customerName, serviceType, scheduledTime, providerId) => {
  try {
    const formattedTime = new Date(scheduledTime).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: customerEmail,
      subject: `Service Confirmed - ${serviceType}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #27ae60;">Service Request Confirmed ✅</h2>
          
          <p>Dear ${customerName},</p>
          
          <p>Your service request has been confirmed! Here are the details:</p>
          
          <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #27ae60;">
            <p style="margin: 0; font-size: 16px;"><strong>📅 Scheduled Time:</strong> ${formattedTime}</p>
            <p style="margin: 5px 0 0 0;"><strong>🔧 Service:</strong> ${serviceType}</p>
            <p style="margin: 5px 0 0 0;"><strong>👨‍🔧 Provider ID:</strong> ${providerId}</p>
          </div>
          
          <p>You will receive a reminder email before your scheduled service time.</p>
          
          <p>Thank you for choosing our home service management system!</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated confirmation. Please do not reply to this email.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendServiceReminder,
  sendServiceConfirmation
};
