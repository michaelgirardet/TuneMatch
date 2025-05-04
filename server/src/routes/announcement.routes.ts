// routes/announcement.routes.ts
import express from 'express';
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  getUserAnnouncements,
  updateAnnouncement,
} from '../controllers/announcement.controller';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/', auth, createAnnouncement);
router.get('/', auth, getAnnouncements);
router.get('/user', auth, getUserAnnouncements);
router.put('/:id', auth, updateAnnouncement);
router.delete('/:id', auth, deleteAnnouncement);

export default router;
