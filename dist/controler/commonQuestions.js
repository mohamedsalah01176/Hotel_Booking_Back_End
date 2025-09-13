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
Object.defineProperty(exports, "__esModule", { value: true });
const ResponseStatus_1 = require("../util/ResponseStatus");
class CommonQuestionsController {
    constructor(commonQuestionsServices) {
        this.commonQuestionsServices = commonQuestionsServices;
    }
    getAllQuestions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const lang = req.query.lang;
            let responseServer = yield this.commonQuestionsServices.handleAllQuestions();
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
    addQuestions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const lang = req.query.lang;
            const body = req.body;
            let responseServer = yield this.commonQuestionsServices.handleAddQuestions(body, lang);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
    deleteQuestions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const questionId = req.params.questionId;
            let responseServer = yield this.commonQuestionsServices.handleDeleteQuestions(questionId);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
    updateQuestions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const questionId = req.params.questionId;
            const lang = req.query.lang;
            const body = req.body;
            let responseServer = yield this.commonQuestionsServices.handleUpdateQuestions(body, questionId, lang);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
    sendQuestionsForEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            let responseServer = yield this.commonQuestionsServices.handleSendQuestionsForEmail(body);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
}
exports.default = CommonQuestionsController;
