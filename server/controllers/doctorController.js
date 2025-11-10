import Doctor from '../models/Doctor.js';
import User from '../models/User.js';

/**
 * @desc    Get all doctors with optional filters
 * @route   GET /api/doctors
 * @access  Public
 */
export const getDoctors = async (req, res, next) => {
  try {
    const { specialization, city, search } = req.query;

    // Build query
    const query = { isAvailable: true };

    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }

    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { specialization: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
      ];
    }

    const doctors = await Doctor.find(query)
      .populate('userId', 'name email avatar')
      .sort({ rating: -1, totalReviews: -1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single doctor by ID
 * @route   GET /api/doctors/:id
 * @access  Public
 */
export const getDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('userId', 'name email avatar phone');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create or update doctor profile
 * @route   POST /api/doctors
 * @access  Private (Doctor only)
 */
export const createDoctorProfile = async (req, res, next) => {
  try {
    const {
      specialization,
      qualification,
      experience,
      consultationFee,
      bio,
      location,
      availability,
    } = req.body;

    // Check if doctor profile already exists
    let doctor = await Doctor.findOne({ userId: req.user.id });

    if (doctor) {
      // Update existing profile
      doctor = await Doctor.findByIdAndUpdate(
        doctor._id,
        {
          specialization,
          qualification,
          experience,
          consultationFee,
          bio,
          location,
          availability,
        },
        { new: true, runValidators: true }
      ).populate('userId', 'name email avatar');
    } else {
      // Create new profile
      doctor = await Doctor.create({
        userId: req.user.id,
        specialization,
        qualification,
        experience,
        consultationFee,
        bio,
        location,
        availability,
      });

      doctor = await Doctor.findById(doctor._id).populate('userId', 'name email avatar');
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all specializations
 * @route   GET /api/doctors/specializations
 * @access  Public
 */
export const getSpecializations = async (req, res, next) => {
  try {
    const specializations = await Doctor.distinct('specialization');

    res.status(200).json({
      success: true,
      data: specializations.sort(),
    });
  } catch (error) {
    next(error);
  }
};

