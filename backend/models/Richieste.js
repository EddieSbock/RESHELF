import mongoose from "mongoose";

const SchemaRichiesta = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    motivo: {
        type: String,
        default: "",
        trim: true
    },
    dataCreazione: {
        type: Date,
        default: Date.now
    }
});

export const Richieste = mongoose.model('Richieste', SchemaRichiesta);