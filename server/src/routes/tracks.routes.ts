import express from 'express';
import { auth } from '../middleware/auth';
import {
  getUserTracks,
  getCurrentUserTracks,
  addTrack,
  deleteTrack,
} from '@/controllers/tracks.controller';

const router = express.Router();

router.get('/user/:id', auth, getUserTracks);
router.get('/', auth, getCurrentUserTracks);
router.post('/', auth, addTrack);
router.delete('/:id', auth, deleteTrack);

export default router;
