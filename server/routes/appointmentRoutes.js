import express from 'express';
import {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  cancelAppointment,
} from '../controllers/appointmentController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, createAppointment)
  .get(protect, getAppointments);

router.route('/:id')
  .get(protect, getAppointment)
  .put(protect, updateAppointment)
  .delete(protect, cancelAppointment);

export default router;

