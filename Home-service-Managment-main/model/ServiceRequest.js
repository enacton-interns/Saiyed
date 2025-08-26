const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  providerId: { type: Number, required: true },
  serviceType: { type: String, required: true },

  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },

  scheduledTime: { type: Date, required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },

  reminderSent: { type: Boolean, default: false },
  notes: { type: String },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
