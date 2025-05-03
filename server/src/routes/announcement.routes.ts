// routes/announcement.routes.ts
import express from 'express';
import { auth } from '../middleware/auth';
import {
  createAnnouncement,
  getAnnouncements,
  getUserAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcement.controller';

const router = express.Router();

router.post('/', auth, createAnnouncement);
router.get('/', auth, getAnnouncements);
router.get('/user', auth, getUserAnnouncements);
router.put('/:id', auth, updateAnnouncement);
router.delete('/:id', auth, deleteAnnouncement);

export default router;
