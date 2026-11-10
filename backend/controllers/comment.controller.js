import { Comment } from '../models/Comment.js';

export const getCommentsByPost = async (req, res, next) => {
    try {
        const commenti = await Comment.find({ post: req.params.postId })
            .sort({ dataCreazione: 1 })
            .populate("autore", "nome");

        return res.status(200).json({ message: "Commenti recuperati", commenti });
    } catch (error) {
        next(error);
    }
};

export const createComment = async (req, res, next) => {
    try {
        const { contenuto, postId } = req.body;
        const autore = req.user._id;

        if (!contenuto || !contenuto.trim() || !postId) {
            return res.status(400).json({ error: true, message: "Il contenuto del commento è obbligatorio" });
        }

        const commento = new Comment({
            contenuto: contenuto.trim(),
            post: postId,
            autore,
            dataCreazione: new Date(),
        });
        await commento.save();

        const commentoPostato = await Comment.findById(commento._id).populate("autore", "nome");
        if (req.SocketCommenti) {
            req.SocketCommenti.to(String(postId)).emit("ricevi_commento", commentoPostato);
        }

        return res.status(201).json({ message: "Commento creato", commentoPostato });
    } catch (error) {
        next(error);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const eliminato = await Comment.findByIdAndDelete(id);

        if (!eliminato) {
            return res.status(404).json({ error: true, message: "Commento non trovato" });
        }

        const postId = String(eliminato.post);
        if (req.SocketCommenti) {
            req.SocketCommenti.to(postId).emit("elimina_commento", String(eliminato._id));
        }

        return res.status(200).json({ message: "Commento eliminato", id: String(eliminato._id) });
    } catch (error) {
        next(error);
    }
};
