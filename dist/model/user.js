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
        required: false,
        unique: true,
        sparse: true,
        match: [/^\+?[1-9]\d{6,14}$/, "Invalid phone format"],
    },
    role: {
        type: String,
        enum: ['host', 'user', 'manager'],
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
    providerId: {
        type: String,
    },
    password: {
        type: String,
        required: false,
        minlength: 8,
    },
    phoneVerfy: {
        type: Boolean,
        required: true,
        default: false
    },
    image: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: null,
    },
    tokenExpireData: {
        type: Date,
        default: null,
    }
}, {
    timestamps: true
});
const UserModel = mongoose_1.default.model('user', Schema);
exports.default = UserModel;
