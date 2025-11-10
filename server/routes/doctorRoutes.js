import express from 'express';
import {
  getDoctors,
  getDoctor,
  createDoctorProfile,
  getSpecializations,
} from '../controllers/doctorController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getDoctors);
router.get('/specializations', getSpecializations);
router.get('/:id', getDoctor);
router.post('/', protect, authorize('doctor'), createDoctorProfile);

export default router;

