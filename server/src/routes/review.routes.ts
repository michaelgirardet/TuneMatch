import express from 'express';
import { createOrUpdateReview, getReviewsByUser } from '../controllers/review.controller';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/', auth, createOrUpdateReview);
router.get('/:userId', auth, getReviewsByUser);

export default router;
