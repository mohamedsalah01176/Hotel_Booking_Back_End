"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commonQuestions_1 = __importDefault(require("../service/commonQuestions"));
const commonQuestions_2 = __importDefault(require("../controler/commonQuestions"));
const user_1 = require("../meddileware/user");
const router = (0, express_1.Router)();
const commonQuestionsServices = new commonQuestions_1.default();
const commonQuestionsController = new commonQuestions_2.default(commonQuestionsServices);
router.get("/questions", (req, res) => commonQuestionsController.getAllQuestions(req, res));
router.post("/questions", user_1.authorizationForManager, (req, res) => commonQuestionsController.addQuestions(req, res));
router.patch("/questions/:questionId", user_1.authorizationForManager, (req, res) => commonQuestionsController.updateQuestions(req, res));
router.delete("/questions/:questionId", user_1.authorizationForManager, (req, res) => commonQuestionsController.deleteQuestions(req, res));
router.post("/sendQuestion", (req, res) => commonQuestionsController.sendQuestionsForEmail(req, res));
exports.default = router;
