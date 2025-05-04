import { searchArtists } from '@/controllers/search.controller';
import express from 'express';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/', auth, searchArtists);
console.log('Route de recherche enregistrée');

export default router;
