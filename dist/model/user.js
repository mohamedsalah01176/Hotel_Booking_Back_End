"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = new mongoose_1.default.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'manager'],
        default: 'user',
        required: true
    },
    birthDate: {
        type: Date
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        match: [/(?=.*[a-zA-Z])(?=.*\d)/, 'Password must contain at least one letter and one number']
    },
    phoneVerfy: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
});
const UserModel = mongoose_1.default.model('user', Schema);
exports.default = UserModel;
