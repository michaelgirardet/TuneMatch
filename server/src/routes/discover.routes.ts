import express from 'express';
import {
  getDiscoverUsers,
  likeUser,
  getMatches,
  deleteMatch,
} from '../controllers/discover.controller';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/users', auth, getDiscoverUsers);
router.post('/like', auth, likeUser);
router.get('/matches', auth, getMatches);
router.delete('/matches/:matchId', auth, deleteMatch);

export default router;
