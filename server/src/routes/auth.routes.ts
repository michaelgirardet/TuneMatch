// routes/auth.routes.ts
import express from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = express.Router();
const authController = new AuthController();

router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/logout', (req, res) => authController.logout(req, res));
router.post('/forgot-password', authController.forgotPassword.bind(authController));
router.post('/reset-password', authController.resetPassword.bind(authController));
router.post('/refresh', authController.refreshToken.bind(authController));
router.post('/refresh-token', (req, res) => authController.refreshToken(req, res));

export default router;
