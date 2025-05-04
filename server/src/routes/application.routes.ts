import {
  applyToAnnouncement,
  getAnnouncementApplications,
  getUserNotifications,
  markNotificationAsRead,
  updateApplicationStatus,
} from '@/controllers/application.controller';
import express from 'express';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/announcements/:id/apply', auth, applyToAnnouncement);
router.get('/announcements/:id/applications', auth, getAnnouncementApplications);
router.put('/:id/status', auth, updateApplicationStatus);
router.get('/notifications', auth, getUserNotifications);
router.put('/notifications/:id/read', auth, markNotificationAsRead);

export default router;
