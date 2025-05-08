import express from 'express';
import { getDiscoverUsers, likeUser, getMatches } from '../controllers/discover.controller';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/users', auth, getDiscoverUsers);
router.post('/like', auth, likeUser);
router.get('/matches', auth, getMatches);

export default router;
