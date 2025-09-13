"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commonQuestions_1 = __importDefault(require("../model/commonQuestions"));
const translateToAr_1 = require("../util/Questions/translateToAr");
const translateToEn_1 = require("../util/Questions/translateToEn");
const sendEmail_1 = require("../util/sendEmail");
class CommonQuestionsServices {
    constructor() { }
    handleAllQuestions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const questions = yield commonQuestions_1.default.find({});
                console.log(questions);
                return {
                    status: "success",
                    questions
                };
            }
            catch (errors) {
                return {
                    status: "error",
                    errors
                };
            }
        });
    }
    handleAddQuestions(body, lang) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const translator = lang === "ar" ? translateToEn_1.translateToEn : translateToAr_1.translateToAr;
                const translated = yield translator(body);
                const newQuestion = new commonQuestions_1.default(translated);
                yield newQuestion.save();
                return {
                    status: "success",
                    message: "Question Added"
                };
            }
            catch (errors) {
                return {
                    status: "error",
                    errors
                };
            }
        });
    }
    handleDeleteQuestions(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteQuestion = yield commonQuestions_1.default.deleteOne({ _id: questionId });
                if (deleteQuestion.deletedCount) {
                    return {
                        status: "success",
                        messageEn: "Question Deleted",
                        messageAr: "تم مسح السؤال"
                    };
                }
                else {
                    return {
                        status: "fail",
                        messageEn: "This question aready exist",
                        messageAr: "هذا السؤال غير موجود بلفعل"
                    };
                }
            }
            catch (errors) {
                return {
                    status: "error",
                    errors
                };
            }
        });
    }
    handleUpdateQuestions(body, questionId, lang) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const translator = lang === "ar" ? translateToEn_1.translateToEn : translateToAr_1.translateToAr;
                const translated = yield translator(body);
                const updateResult = yield commonQuestions_1.default.updateOne({ _id: questionId }, { $set: Object.assign({}, translated) });
                if (updateResult.modifiedCount <= 0) {
                    return {
                        status: "fail",
                        message: "لم يتم العثور على السؤال"
                    };
                }
                return {
                    status: "success",
                    message: "Question Updated"
                };
            }
            catch (errors) {
                return {
                    status: "error",
                    errors
                };
            }
        });
    }
    handleSendQuestionsForEmail(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, sendEmail_1.sendEmail)(body, "question");
                return {
                    status: "success",
                    message: "Emial Sended"
                };
            }
            catch (errors) {
                return {
                    status: "error",
                    errors
                };
            }
        });
    }
}
exports.default = CommonQuestionsServices;
