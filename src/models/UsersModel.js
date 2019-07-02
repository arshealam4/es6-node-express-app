import db from '../lib/maindb';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    password: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    gender: {
        type: String,
    },
    timestamp: {type: Date, default: Date.now},
});

const model = db.model('Users', usersSchema);

export default model;
