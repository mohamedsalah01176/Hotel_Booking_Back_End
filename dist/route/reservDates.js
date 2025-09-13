"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reservDates_1 = __importDefault(require("../controler/reservDates"));
const user_1 = require("../meddileware/user");
const reservDates_2 = __importDefault(require("../service/reservDates"));
const router = (0, express_1.Router)();
const resvervService = new reservDates_2.default();
const reservController = new reservDates_1.default(resvervService);
router.post("/reserve/:propertyId", user_1.authentication, (req, res) => reservController.revesveDates(req, res));
router.get("/reserve/:propertyId", user_1.authentication, (req, res) => reservController.getReserveDateForProperty(req, res));
router.get("/reservedDates", user_1.authentication, (req, res) => reservController.getReserveDateForUser(req, res));
router.get("/allReservedDates", user_1.authentication, (req, res) => reservController.getAllReserveDate(req, res));
router.delete("/reservedDates/:dateId", user_1.authentication, (req, res) => reservController.deleteRevervedDate(req, res));
exports.default = router;
