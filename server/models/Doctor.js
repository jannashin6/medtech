import mongoose from 'mongoose';

/**
 * Doctor Schema
 * Extends User model with doctor-specific information
 */
const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: [true, 'Please provide specialization'],
      trim: true,
    },
    qualification: {
      type: String,
      required: [true, 'Please provide qualification'],
      trim: true,
    },
    experience: {
      type: Number,
      required: [true, 'Please provide years of experience'],
      min: 0,
    },
    consultationFee: {
      type: Number,
      required: [true, 'Please provide consultation fee'],
      min: 0,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    location: {
      address: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      pincode: {
        type: String,
        trim: true,
      },
    },
    availability: {
      days: [
        {
          day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          },
          slots: [
            {
              start: String,
              end: String,
            },
          ],
        },
      ],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;

