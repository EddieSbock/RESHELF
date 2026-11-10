import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/User.js';

dotenv.config();

export const verificaJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        return res.status(401).json({ error: true, message: "Non sei autorizzato" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.data).select("-password");

        if (!user) {
            return res.status(403).json({ error: true, message: "Utente non trovato" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Errore verifica JWT:", error.message);
        return res.status(401).json({ error: true, message: "Sessione non valida o scaduta, effettua nuovamente il login" });
    }
};

export const verificaRuolo = (ruoloValido) => {
    return (req, res, next) => {
        if (req.user && req.user.ruolo === ruoloValido) {
            next();
        } else {
            return res.status(403).json({ error: true, message: "Accesso negato" });
        }
    };
};