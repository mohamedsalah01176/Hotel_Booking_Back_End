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
class ReviewController {
    constructor(reviewServices) {
        this.reviewServices = reviewServices;
    }
    addReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const lang = req.query.lang;
            const propertyId = req.params.propertyId;
            const user = req.user;
            let responseServer = yield this.reviewServices.handleAddReview(body, user, propertyId, lang);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
    deleteReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const reviewId = req.params.reviewId;
            const user = req.user;
            let responseServer = yield this.reviewServices.handleDeleteReview(user, reviewId);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
    updateReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const reviewId = req.params.reviewId;
            const user = req.user;
            const body = req.body;
            const lang = req.query.lang;
            let responseServer = yield this.reviewServices.handleUpdateReview(user, reviewId, body, lang);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
}
exports.default = ReviewController;
