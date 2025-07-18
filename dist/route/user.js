"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("../service/user"));
const user_2 = __importDefault(require("../controler/user"));
const router = (0, express_1.Router)();
const userService = new user_1.default();
const userControler = new user_2.default(userService);
router.post("/sendCode", (req, res) => userControler.sendCode(req, res));
router.post("/verfyCode", (req, res) => userControler.verfyCode(req, res));
router.post("/register", (req, res) => userControler.register(req, res));
router.post("/login", (req, res) => userControler.login(req, res));
router.post("/forgetPassword", (req, res) => userControler.forgetPassword(req, res));
router.post("/resetPassword", (req, res) => userControler.resetPassword(req, res));
exports.default = router;
