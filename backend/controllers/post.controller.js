import { Post } from '../models/Post.js';
import { Comment } from '../models/Comment.js';

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const createPost = async (req, res, next) => {
    try {
        const { titolo, corpo, categorie, registi, cast, riassunto, voto, cover } = req.body;
        const autore = req.user._id;

        const post = new Post({
            titolo,
            corpo,
            registi,
            cast,
            riassunto,
            categorie,
            autore,
            voto: voto !== undefined ? Number(voto) : 0,
            cover,
            dataCreazione: new Date(),
        });

        await post.save();
        return res.status(201).json({ message: "Post creato", post });
    } catch (error) {
        next(error);
    }
};

export const getPosts = async (req, res, next) => {
    try {
        const { categoria, ricerca } = req.query;
        const query = {};

        if (categoria) {
            query.categorie = categoria;
        }

        if (ricerca && ricerca.trim() !== "") {
            const safeSearch = escapeRegex(ricerca.trim());
            query.$or = [
                { titolo: { $regex: safeSearch, $options: 'i' } },
                { corpo: { $regex: safeSearch, $options: 'i' } },
            ];
        }

        const postati = await Post.find(query)
            .sort({ dataCreazione: -1 })
            .populate("autore", "nome");

        return res.status(200).json({ message: "Post recuperati", postati });
    } catch (error) {
        next(error);
    }
};

export const getTopPosts = async (req, res, next) => {
    try {
        const miglioriPost = await Post.find()
            .sort({ voto: -1 })
            .limit(5)
            .select("titolo voto _id");

        return res.status(200).json({ message: "Migliori post recuperati", miglioriPost });
    } catch (error) {
        next(error);
    }
};

export const getPostById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id).populate("autore", "nome");

        if (!post) {
            return res.status(404).json({ error: true, message: "Post non trovato" });
        }

        return res.status(200).json({ message: "Post recuperato", post });
    } catch (error) {
        next(error);
    }
};

export const updatePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { titolo, corpo, categorie, registi, cast, riassunto, voto, cover } = req.body;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: true, message: "Post inesistente" });
        }

        if (titolo !== undefined) post.titolo = titolo;
        if (corpo !== undefined) post.corpo = corpo;
        if (categorie !== undefined) post.categorie = categorie;
        if (voto !== undefined) post.voto = Number(voto);
        if (registi !== undefined) post.registi = registi;
        if (cast !== undefined) post.cast = cast;
        if (riassunto !== undefined) post.riassunto = riassunto;
        if (cover !== undefined) post.cover = cover;

        await post.save();
        return res.status(200).json({ message: "Post aggiornato", post });
    } catch (error) {
        next(error);
    }
};

export const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const eliminato = await Post.findByIdAndDelete(id);

        if (!eliminato) {
            return res.status(404).json({ error: true, message: "Post non trovato" });
        }

        await Comment.deleteMany({ post: id });
        return res.status(200).json({ message: "Post eliminato" });
    } catch (error) {
        next(error);
    }
};
