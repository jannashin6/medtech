import express from 'express';
import { chatWithAI, getChatHistory, clearChatHistory } from '../controllers/aiController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/chat', protect, chatWithAI);
router.get('/chat/history', protect, getChatHistory);
router.delete('/chat/history', protect, clearChatHistory);

export default router;

