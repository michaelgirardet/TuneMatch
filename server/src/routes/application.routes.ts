import { getUserNotifications, markNotificationAsRead } from '@/controllers/application.controller';
import express from 'express';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/notifications', auth, getUserNotifications);
router.put('/notifications/:id/read', auth, markNotificationAsRead);

export default router;
