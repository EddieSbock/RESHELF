import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { RUOLI } from '../config/costanti.js';

const SchemaUser = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    ruolo: {
        type: String,
        enum: [RUOLI.ADMIN, RUOLI.USER],
        default: RUOLI.USER
    }
});

SchemaUser.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

SchemaUser.methods.verificaPassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

export const User = mongoose.model('User', SchemaUser);