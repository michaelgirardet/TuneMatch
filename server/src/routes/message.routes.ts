import express from 'express';
import { auth } from '../middleware/auth';
import { getConversations, getMessages, sendMessage } from '@/controllers/message.controller';

const router = express.Router();

router.get('/conversations', auth, getConversations);
router.get('/:id', auth, getMessages);
router.post('/', auth, sendMessage);

export default router;
