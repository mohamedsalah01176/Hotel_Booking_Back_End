"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    name: {
        required: true,
        type: String,
        minlength: 3,
        message: "Name of city is required and greater than 3 char"
    },
    nameEn: {
        type: String,
    },
    nameAr: {
        type: String,
    },
    numberOfHotel: {
        type: Number,
        default: 0,
    },
    isDangerousPlace: {
        type: Boolean,
        required: true
    },
});
const CityModel = mongoose_1.default.model("city", schema);
exports.default = CityModel;
