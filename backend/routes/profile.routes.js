import { Router } from 'express';
import { verificaJWT } from '../middleware/auth.js';
import { getProfile, updateProfile, updatePassword } from '../controllers/profile.controller.js';

const router = Router();

router.get('/', verificaJWT, getProfile);
router.patch('/', verificaJWT, updateProfile);
router.patch('/password', verificaJWT, updatePassword);

export default router;
