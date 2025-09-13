"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../meddileware/user");
const express_1 = require("express");
const dashboard_1 = __importDefault(require("../service/dashboard"));
const dashboard_2 = __importDefault(require("../controler/dashboard"));
const router = (0, express_1.Router)();
const dashboardService = new dashboard_1.default();
const dashboardController = new dashboard_2.default(dashboardService);
router.get("/dashboard", user_1.authorizationForManager, (req, res) => dashboardController.analysisData(req, res));
router.get("/chart", user_1.authorizationForManager, (req, res) => dashboardController.getChartData(req, res));
router.get("/topProperty", user_1.authorizationForManager, (req, res) => dashboardController.getTopProperty(req, res));
exports.default = router;
