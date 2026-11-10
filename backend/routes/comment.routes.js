import { Router } from 'express';
import { verificaJWT, verificaRuolo } from '../middleware/auth.js';
import { RUOLI } from '../config/costanti.js';
import {
    getCommentsByPost,
    createComment,
    deleteComment,
} from '../controllers/comment.controller.js';

const router = Router();

router.get('/:postId', getCommentsByPost);
router.post('/', verificaJWT, createComment);
router.delete('/:id', verificaJWT, verificaRuolo(RUOLI.ADMIN), deleteComment);

export default router;
