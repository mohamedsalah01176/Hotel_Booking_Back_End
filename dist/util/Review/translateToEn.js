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
const translate = require("translate-google");
const translateToEn = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const translated = JSON.parse(JSON.stringify(body));
    try {
        if (body.data) {
            translated.dataAr = body.data;
            translated.dataEn = yield translate(body.data, { from: "ar", to: "en" });
        }
        console.log(translated);
        return translated;
    }
    catch (err) {
        console.error("❌ Translation Error:", err);
        return translated;
    }
});
exports.translateToEn = translateToEn;
