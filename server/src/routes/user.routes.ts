import express from 'express';
import { auth } from '../middleware/auth';
import {
  getUserProfile,
  updatePhoto,
  updateSocialLinks,
  updateGenres,
  updateBiography,
  updateLocation,
  updateProfile,
} from '../controllers/user.controller';

const router = express.Router();

router.get('/:id', auth, getUserProfile);
router.put('/photo', auth, updatePhoto);
router.put('/social-links', auth, updateSocialLinks);
router.put('/genres', auth, updateGenres);
router.put('/biography', auth, updateBiography);
router.put('/location', auth, updateLocation);
router.put('/profile', auth, updateProfile);

export default router;
