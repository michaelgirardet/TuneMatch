import express from 'express';
import { testController } from '../controllers/test.controller';

const router = express.Router();

/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: Test si l'API fonctionne
 *     responses:
 *       200:
 *         description: Message de test
 */
router.get('/test', testController.getTest);

export default router; 