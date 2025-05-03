import express from 'express';
import { completeProfile } from '../controllers/completeProfile.controller';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/users/profile', auth, completeProfile);

export default router;
