import { Router } from 'express';
import { verificaJWT, verificaRuolo } from '../middleware/auth.js';
import { RUOLI } from '../config/costanti.js';
import {
    createPost,
    getPosts,
    getTopPosts,
    getPostById,
    updatePost,
    deletePost,
} from '../controllers/post.controller.js';

const router = Router();

router.get('/', getPosts);
router.get('/top', getTopPosts);
router.get('/:id', getPostById);
router.post('/', verificaJWT, verificaRuolo(RUOLI.ADMIN), createPost);
router.patch('/:id', verificaJWT, verificaRuolo(RUOLI.ADMIN), updatePost);
router.delete('/:id', verificaJWT, verificaRuolo(RUOLI.ADMIN), deletePost);

export default router;
