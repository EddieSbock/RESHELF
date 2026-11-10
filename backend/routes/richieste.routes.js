import { Router } from 'express';
import { verificaJWT, verificaRuolo } from '../middleware/auth.js';
import { RUOLI } from '../config/costanti.js';
import {
    getRichieste,
    createRichiesta,
    approveRichiesta,
    deleteRichiesta,
} from '../controllers/richieste.controller.js';

const router = Router();

router.get('/', verificaJWT, verificaRuolo(RUOLI.ADMIN), getRichieste);
router.post('/', verificaJWT, createRichiesta);
router.patch('/:id', verificaJWT, verificaRuolo(RUOLI.ADMIN), approveRichiesta);
router.delete('/:id', verificaJWT, verificaRuolo(RUOLI.ADMIN), deleteRichiesta);

export default router;
