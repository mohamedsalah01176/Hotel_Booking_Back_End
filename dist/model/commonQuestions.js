"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    question: {
        type: String,
        required: true,
    },
    questionEn: {
        type: String,
    },
    questionAr: {
        type: String,
    },
    answer: {
        type: String,
        required: true,
    },
    answerEn: {
        type: String,
    },
    answerAr: {
        type: String,
    }
});
const QuestionsModel = mongoose_1.default.model("commonQuestion", schema);
exports.default = QuestionsModel;
