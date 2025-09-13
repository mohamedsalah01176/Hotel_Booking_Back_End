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
const property_1 = __importDefault(require("../model/property"));
const translateToAr_1 = require("../util/Review/translateToAr");
const translateToEn_1 = require("../util/Review/translateToEn");
class ReviewServices {
    handleAddReview(body, user, propertyId, lang) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let propertyUpdated;
                if (lang === "en") {
                    console.log(lang);
                    const translaedBody = yield (0, translateToAr_1.translateToAr)(body);
                    propertyUpdated = yield property_1.default.updateOne({ _id: propertyId }, { $push: { reviews: Object.assign(Object.assign({}, translaedBody), { user: user }) } });
                }
                else {
                    const translaedBody = yield (0, translateToEn_1.translateToEn)(body);
                    propertyUpdated = yield property_1.default.updateOne({ _id: propertyId }, { $push: { reviews: Object.assign(Object.assign({}, translaedBody), { user }) } });
                }
                if (propertyUpdated.modifiedCount > 0) {
                    const property = yield property_1.default.findOne({ _id: propertyId });
                    const lengthReview = property === null || property === void 0 ? void 0 : property.reviews.length;
                    const totalRating = property === null || property === void 0 ? void 0 : property.reviews.reduce((acc, item) => acc + (item.rate || 0), 0);
                    const averageRate = lengthReview > 0 ? totalRating / lengthReview : 0;
                    yield property_1.default.updateOne({ _id: propertyId }, { $set: { rate: Number(averageRate.toFixed(1)) } });
                    return {
                        status: "success",
                        message: "Review Added"
                    };
                }
                else {
                    return {
                        status: "fail",
                        message: "Not Found Any Property"
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
    handleDeleteReview(user, reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let propertyUpdated;
                if (user.role === "manager") {
                    propertyUpdated = yield property_1.default.updateOne({ "reviews._id": reviewId }, { $pull: { reviews: { _id: reviewId } } });
                }
                else {
                    propertyUpdated = yield property_1.default.updateOne({ "reviews._id": reviewId, "reviews.user._id": user._id }, { $pull: { reviews: { _id: reviewId } } });
                }
                if (propertyUpdated.modifiedCount > 0) {
                    return {
                        status: "success",
                        message: "Review Deleted"
                    };
                }
                else {
                    return {
                        status: "fail",
                        message: "Not Found Any Property"
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
    handleUpdateReview(user, reviewId, body, lang) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filter = user.role === "manager" ? { "reviews._id": reviewId } : { "reviews._id": reviewId, "reviews.user._id": user._id };
                const translateBody = lang === "en" ? yield (0, translateToAr_1.translateToAr)(body) : yield (0, translateToEn_1.translateToEn)(body);
                let propertyUpdated = yield property_1.default.updateOne(filter, {
                    $set: {
                        "reviews.$.data": translateBody.data,
                        "reviews.$.dataEn": translateBody.dataEn,
                        "reviews.$.dataAr": translateBody.dataAr,
                        "reviews.$.rate": translateBody.rate,
                    }
                });
                if (propertyUpdated.modifiedCount > 0) {
                    return {
                        status: "success",
                        message: "Review Updated"
                    };
                }
                else {
                    return {
                        status: "fail",
                        message: "Not Found Any Property"
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
}
exports.default = ReviewServices;
