import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';

/**
 * @desc    Create new appointment
 * @route   POST /api/appointments
 * @access  Private
 */
export const createAppointment = async (req, res, next) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, reason, notes } = req.body;

    // Validate doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    // Check if doctor is available
    if (!doctor.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Doctor is currently not available',
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      appointmentDate,
      appointmentTime,
      reason,
      notes,
    });

    // Populate doctor and patient details
    await appointment.populate('doctorId', 'specialization consultationFee');
    await appointment.populate('doctorId', null, null, { populate: { path: 'userId', select: 'name email avatar' } });
    await appointment.populate('patientId', 'name email');

    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all appointments for logged in user
 * @route   GET /api/appointments
 * @access  Private
 */
export const getAppointments = async (req, res, next) => {
  try {
    let query = {};

    // If user is a doctor, show their appointments
    // If user is a patient, show their appointments
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.id });
      if (doctor) {
        query.doctorId = doctor._id;
      } else {
        return res.status(200).json({
          success: true,
          count: 0,
          data: [],
        });
      }
    } else {
      query.patientId = req.user.id;
    }

    const appointments = await Appointment.find(query)
      .populate('doctorId', 'specialization consultationFee')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email avatar' },
      })
      .populate('patientId', 'name email')
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single appointment
 * @route   GET /api/appointments/:id
 * @access  Private
 */
export const getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctorId', 'specialization consultationFee')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email avatar' },
      })
      .populate('patientId', 'name email');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Check if user has access to this appointment
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.id });
      if (doctor && appointment.doctorId._id.toString() !== doctor._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this appointment',
        });
      }
    } else {
      if (appointment.patientId._id.toString() !== req.user.id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this appointment',
        });
      }
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update appointment status
 * @route   PUT /api/appointments/:id
 * @access  Private
 */
export const updateAppointment = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Check authorization
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.id });
      if (doctor && appointment.doctorId.toString() !== doctor._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this appointment',
        });
      }
    } else {
      if (appointment.patientId.toString() !== req.user.id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this appointment',
        });
      }
    }

    // Update appointment
    if (status) appointment.status = status;
    if (notes) appointment.notes = notes;

    await appointment.save();

    await appointment.populate('doctorId', 'specialization consultationFee');
    await appointment.populate({
      path: 'doctorId',
      populate: { path: 'userId', select: 'name email avatar' },
    });
    await appointment.populate('patientId', 'name email');

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel appointment
 * @route   DELETE /api/appointments/:id
 * @access  Private
 */
export const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Check authorization
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.id });
      if (doctor && appointment.doctorId.toString() !== doctor._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to cancel this appointment',
        });
      }
    } else {
      if (appointment.patientId.toString() !== req.user.id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to cancel this appointment',
        });
      }
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
};

