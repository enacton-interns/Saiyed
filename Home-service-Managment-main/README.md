# Home Service Management System

A comprehensive Node.js application for managing home services with automated email reminders and scheduling capabilities.

## 🚀 Features

### Core Features:
- **Customer Profiles**: Store user details (name, contact, address, email) with service history
- **Service Providers**: Manage service provider details (name, skills, availability)
- **Service Requests**: Track active and completed service requests with timestamps
- **Email Notifications**: Automated confirmation and reminder emails
- **Smart Scheduling**: Automated reminder system that sends emails 1-2 hours before scheduled services

### Email System Features:
- ✅ **Service Confirmation Emails**: Sent immediately when a service is booked
- ⏰ **Automated Reminders**: Sent 1-2 hours before scheduled service time
- 📧 **Manual Reminders**: API endpoint to send reminders on-demand
- 🔄 **Cron-based Scheduling**: Checks for upcoming services every 30 minutes

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Aiyatullah/Home-service-Managment.git
   cd Home-service-Managment
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env`
   - Configure your email settings:
     ```
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-app-password
     ```

4. **Start MongoDB** (make sure MongoDB is running on localhost:27017)

5. **Run the application**:
   ```bash
   node server.js
   ```

## 🔧 API Endpoints

### Service Requests
- `POST /request/:providerId` - Create new service request
- `GET /request/` - Get all service requests
- `GET /request/active` - Get active service requests
- `GET /request/completed` - Get completed service requests
- `PUT /request/update/:requestId` - Update service request
- `POST /request/reminder/:requestId` - Send manual reminder

### Example Request Body (Create Service):
```json
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "serviceType": "Plumbing",
  "scheduledTime": "2025-08-13T15:30:00.000Z",
  "notes": "Kitchen sink repair"
}
```

## 📧 Email Configuration

For Gmail:
1. Enable 2-factor authentication
2. Generate an app-specific password
3. Use the app password in your `.env` file

## 🕐 Reminder System

- **Automatic**: Checks every 30 minutes for upcoming services
- **Timing**: Sends reminders 1-2 hours before scheduled time
- **Status Tracking**: Prevents duplicate reminders with `reminderSent` flag
- **Manual Override**: API endpoint for on-demand reminders

## 🗄️ Database Schema

### ServiceRequest Model:
- `customerName` (String, required)
- `customerEmail` (String, required)
- `providerId` (Number, required)
- `serviceType` (String, required)
- `scheduledTime` (Date, required)
- `status` (enum: pending, in-progress, completed)
- `reminderSent` (Boolean, default: false)
- `startTime`, `endTime`, `notes`, `createdAt`

## 🚦 Getting Started

1. Start the server: `node server.js`
2. The reminder scheduler starts automatically
3. Create service requests via API
4. Email confirmations and reminders are sent automatically

## 📝 Additional Enhancements

- Add a feedback system to allow customers to rate services
- Include support for recurring requests
- Frontend integration (coming soon)
- SMS notifications
- Calendar integration
