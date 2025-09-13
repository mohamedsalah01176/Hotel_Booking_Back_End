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
exports.translateToAr = void 0;
const parseServicesFromFlatBody_1 = require("../parseServicesFromFlatBody");
const translate = require("translate-google");
const translateToAr = (body) => __awaiter(void 0, void 0, void 0, function* () {
    (0, parseServicesFromFlatBody_1.parseServicesFromFlatBody)(body);
    const translated = JSON.parse(JSON.stringify(body));
    try {
        if (body.title) {
            translated.titleEn = body.title;
            translated.titleAr = yield translate(body.title, { from: "en", to: "ar" });
        }
        if (body.description) {
            translated.descriptionEn = body.description;
            translated.descriptionAr = yield translate(body.description, { from: "en", to: "ar" });
        }
        if (body.location) {
            translated.location.cityEn = body.location.city.toLowerCase();
            translated.location.cityAr = yield translate(body.location.city, { from: "en", to: "ar" });
            translated.location.addressEn = body.location.address;
            translated.location.addressAr = yield translate(body.location.address, { from: "en", to: "ar" });
        }
        if (Array.isArray(body.services) && body.services.length > 0) {
            translated.services = [];
            for (const service of body.services) {
                const translatedService = yield translate(service.service || "", { from: "en", to: "ar" });
                translated.services.push({ service: service.service, serviceEn: service.service, serviceAr: translatedService });
            }
        }
        if (Array.isArray(body.reviews) && body.reviews.length > 0) {
            translated.reviews = [];
            for (const review of body.reviews) {
                const translatedComment = yield translate(review.data || "", { from: "en", to: "ar" });
                translated.reviews.push(Object.assign(Object.assign({}, review), { data: review.data, dataEn: review.data, dataAr: translatedComment }));
            }
        }
        console.log(body, "before");
        console.log(translated, "after");
        return translated;
    }
    catch (err) {
        console.error("❌ Translation Error:", err);
        return translated;
    }
});
exports.translateToAr = translateToAr;
