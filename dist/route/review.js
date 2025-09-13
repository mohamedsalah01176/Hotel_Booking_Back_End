"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_1 = __importDefault(require("../service/review"));
const review_2 = __importDefault(require("../controler/review"));
const user_1 = require("../meddileware/user");
const router = (0, express_1.Router)();
const reviewServices = new review_1.default();
const reviewController = new review_2.default(reviewServices);
router.post("/review/:propertyId", user_1.authentication, (req, res) => reviewController.addReview(req, res));
router.delete("/review/:reviewId", user_1.authentication, (req, res) => reviewController.deleteReview(req, res));
router.patch("/review/:reviewId", user_1.authentication, (req, res) => reviewController.updateReview(req, res));
exports.default = router;
