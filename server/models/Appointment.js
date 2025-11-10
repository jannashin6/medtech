import mongoose from 'mongoose';

/**
 * Appointment Schema
 * Links patients with doctors and stores appointment details
 */
const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Please provide appointment date'],
    },
    appointmentTime: {
      type: String,
      required: [true, 'Please provide appointment time'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    reason: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
appointmentSchema.index({ patientId: 1, appointmentDate: 1 });
appointmentSchema.index({ doctorId: 1, appointmentDate: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;

