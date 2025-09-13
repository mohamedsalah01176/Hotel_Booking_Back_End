"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const city_1 = __importDefault(require("../controler/city"));
const city_2 = __importDefault(require("../service/city"));
const express_1 = require("express");
const router = (0, express_1.Router)();
const cityService = new city_2.default();
const cityController = new city_1.default(cityService);
router.get("/city", (req, res) => cityController.allCities(req, res));
router.delete("/city/:cityName", (req, res) => cityController.deleteCity(req, res));
router.patch("/city/:cityName", (req, res) => cityController.updateCity(req, res));
exports.default = router;
