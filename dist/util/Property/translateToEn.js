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
exports.translateToEn = void 0;
const parseServicesFromFlatBody_1 = require("../parseServicesFromFlatBody");
const translate = require("translate-google");
const translateToEn = (body) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    (0, parseServicesFromFlatBody_1.parseServicesFromFlatBody)(body);
    let translatedBody = JSON.parse(JSON.stringify(body));
    try {
        if (body.title) {
            translatedBody.titleAr = body.title;
            translatedBody.titleEn = yield translate(body.title, { from: "ar", to: "en" });
        }
        if (body.description) {
            translatedBody.descriptionAr = body.description;
            translatedBody.descriptionEn = yield translate(body.description, { from: "ar", to: "en" });
        }
        if (body.location.city) {
            translatedBody.location.cityAr = (_a = body.location.city) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            translatedBody.location.cityEn = (_b = (yield translate(body.location.city, { from: "ar", to: "en" }))) === null || _b === void 0 ? void 0 : _b.toLowerCase();
            translatedBody.location.addressAr = body.location.address;
            translatedBody.location.addressEn = yield translate(body.location.address, { from: "ar", to: "en" });
        }
        if (Array.isArray(body.services) && body.services.length > 0) {
            translatedBody.services = [];
            for (const service of body.services) {
                const translatedService = yield translate(service.service, { from: "ar", to: "en" });
                translatedBody.services.push({ service: service.service, serviceAr: service.service, serviceEn: translatedService });
            }
        }
        if (Array.isArray(body.reviews) && body.reviews.length > 0) {
            translatedBody.reviews = [];
            for (const review of body.reviews) {
                const translatedReview = yield translate(review.data, { from: "ar", to: "en" });
                translatedBody.reviews.push(Object.assign(Object.assign({}, review), { data: review.data, dataAr: review.data, dataEn: translatedReview }));
            }
        }
        // console.log("✅ Translated Body:", JSON.stringify(translatedBody, null, 2));
        console.log(translatedBody);
        return translatedBody;
    }
    catch (err) {
        console.error("❌ Translation Error:", err);
        return translatedBody;
    }
});
exports.translateToEn = translateToEn;
