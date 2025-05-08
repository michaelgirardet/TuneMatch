import express from 'express';
import { auth } from '../middleware/auth';
import {
  getCurrentUserProfile,
  updateBiography,
  updateGenres,
  updateLocation,
  updatePhoto,
  updateSocialLinks,
} from '../controllers/user.controller';

const router = express.Router();

router.get('/me', auth, getCurrentUserProfile);
router.get('/:id', auth, getCurrentUserProfile);
router.put('/photo', auth, updatePhoto);
router.put('/social-links', auth, updateSocialLinks);
router.put('/genres', auth, updateGenres);
router.put('/biography', auth, updateBiography);
router.put('/location', auth, updateLocation);

export default router;
