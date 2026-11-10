import mongoose from "mongoose";
import { CATEGORIE_FILM } from "../config/costanti.js";

const SchemaPost = new mongoose.Schema({
    titolo: {
        type: String,
        required: true,
        trim: true
    },
    corpo: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 5000,
    },

    //implementare poi degli array per registri e cast
    registi: {
        type: String,
        default: ""
    },
    cast: {
        type: String,
        default: ""
    },
    riassunto: {
        type: String,
        default: ""
    },
    autore: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dataCreazione: {
        type: Date,
        default: Date.now
    },
    voto: {
        type: Number,
        default: 0,
        min: 0,
        max: 10
    },
    categorie: [{
        type: String,
        enum: CATEGORIE_FILM,
        required: true
    }],
    cover: {
        type: String,
        default: ""
    }
});

export const Post = mongoose.model('Post', SchemaPost);