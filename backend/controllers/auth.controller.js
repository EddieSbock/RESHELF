import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { RUOLI } from '../config/costanti.js';

export const register = async (req, res, next) => {
    try {
        const { nome, email, password } = req.body;

        if (!nome || !email || !password) {
            return res.status(400).json({ error: true, message: "Nome, email e password sono obbligatori" });
        }

        const esistente = await User.findOne({
            $or: [{ email: email.toLowerCase().trim() }, { nome: nome.trim() }]
        });

        if (esistente) {
            const msg = esistente.email === email.toLowerCase().trim()
                ? "Email già registrata"
                : "Nome utente già in uso";
            return res.status(400).json({ error: true, message: msg });
        }

        const user = new User({
            nome: nome.trim(),
            email: email.toLowerCase().trim(),
            password,
            ruolo: RUOLI.USER,
        });

        await user.save();
        return res.status(201).json({ message: "Utente registrato con successo" });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: true, message: "Inserisci email e password" });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user || !(await user.verificaPassword(password))) {
            return res.status(400).json({ error: true, message: "Email o password errati" });
        }

        const token = jwt.sign(
            { data: user._id, ruolo: user.ruolo },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        const userSafe = {
            _id: user._id,
            nome: user.nome,
            email: user.email,
            ruolo: user.ruolo,
        };

        return res.status(200).json({
            message: "Login effettuato",
            token,
            user: userSafe,
        });
    } catch (error) {
        next(error);
    }
};
