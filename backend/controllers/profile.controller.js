import { User } from '../models/User.js';

export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ error: true, message: "Utente non trovato" });
        }
        return res.status(200).json({ message: "Profilo utente", user });
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const { nome, email } = req.body;

        if (!nome || !email) {
            return res.status(400).json({ error: true, message: "Nome ed email sono obbligatori" });
        }

        const duplicato = await User.findOne({
            _id: { $ne: req.user._id },
            $or: [{ email: email.toLowerCase().trim() }, { nome: nome.trim() }]
        });

        if (duplicato) {
            return res.status(400).json({ error: true, message: "Nome utente o email già in uso da un altro account" });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { nome: nome.trim(), email: email.toLowerCase().trim() },
            { new: true, runValidators: true }
        ).select("-password");

        return res.status(200).json({ message: "Profilo aggiornato", user });
    } catch (error) {
        next(error);
    }
};

export const updatePassword = async (req, res, next) => {
    try {
        const { password, nuovaPassword } = req.body;

        if (!password || !nuovaPassword) {
            return res.status(400).json({ error: true, message: "Inserisci sia la password attuale che la nuova password" });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: true, message: "Utente non trovato" });
        }

        const passwordValida = await user.verificaPassword(password);
        if (!passwordValida) {
            return res.status(400).json({ error: true, message: "Password attuale errata" });
        }

        user.password = nuovaPassword;
        await user.save();

        return res.status(200).json({ message: "Password aggiornata con successo" });
    } catch (error) {
        next(error);
    }
};
