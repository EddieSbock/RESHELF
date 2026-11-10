import { Richieste } from '../models/Richieste.js';
import { User } from '../models/User.js';
import { RUOLI } from '../config/costanti.js';

export const getRichieste = async (req, res, next) => {
    try {
        const richieste = await Richieste.find()
            .sort({ dataCreazione: -1 })
            .populate("user", "nome email");

        return res.status(200).json({ message: "Richieste recuperate", richieste });
    } catch (error) {
        next(error);
    }
};

export const createRichiesta = async (req, res, next) => {
    try {
        const { motivo } = req.body;
        const user = req.user._id;

        if (!motivo || !motivo.trim()) {
            return res.status(400).json({ error: true, message: "Inserisci una motivazione valida" });
        }

        const giaInviata = await Richieste.findOne({ user });
        if (giaInviata) {
            return res.status(400).json({ error: true, message: "Hai già una richiesta in attesa di revisione" });
        }

        const richiesta = new Richieste({
            user,
            motivo: motivo.trim(),
        });

        await richiesta.save();
        return res.status(201).json({ message: "Richiesta inviata con successo" });
    } catch (error) {
        next(error);
    }
};

export const approveRichiesta = async (req, res, next) => {
    try {
        const richiesta = await Richieste.findById(req.params.id);
        if (!richiesta) {
            return res.status(404).json({ error: true, message: "Richiesta non trovata" });
        }

        await User.findByIdAndUpdate(
            richiesta.user,
            { ruolo: RUOLI.ADMIN },
            { new: true }
        );

        await Richieste.findByIdAndDelete(req.params.id);

        return res.status(200).json({ message: "Richiesta approvata e utente promosso ad admin" });
    } catch (error) {
        next(error);
    }
};

export const deleteRichiesta = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Richieste.findByIdAndDelete(id);
        return res.status(200).json({ message: "Richiesta eliminata" });
    } catch (error) {
        next(error);
    }
};
