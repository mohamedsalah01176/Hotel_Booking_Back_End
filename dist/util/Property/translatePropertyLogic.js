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
exports.translateToArLogic = exports.translateToEnLogic = void 0;
const city_1 = __importDefault(require("../../model/city"));
const property_1 = __importDefault(require("../../model/property"));
const translateToAr_1 = require("./translateToAr");
const translateToEn_1 = require("./translateToEn");
const dangerousPlace_1 = require("../dangerousPlace");
const translateToEnLogic = (body, adminBody) => __awaiter(void 0, void 0, void 0, function* () {
    const translatedBody = yield (0, translateToEn_1.translateToEn)(body);
    const isDangerousPlace = dangerousPlace_1.dangerousPlaces.some(item => { var _a; return item.toLowerCase() === ((_a = body.location.cityEn) === null || _a === void 0 ? void 0 : _a.toLowerCase()); });
    const foundProperty = yield property_1.default.findOne({ "admin._id": adminBody === null || adminBody === void 0 ? void 0 : adminBody._id });
    let newProperty;
    if (foundProperty && foundProperty.isConfirmed === true) {
        newProperty = new property_1.default(Object.assign(Object.assign({}, translatedBody), { admin: adminBody, isDangerousPlace, isConfirmed: true }));
    }
    else {
        newProperty = new property_1.default(Object.assign(Object.assign({}, translatedBody), { admin: adminBody, isActive: false, isDangerousPlace, isConfirmed: false }));
    }
    yield newProperty.save();
    const cityUpdated = yield city_1.default.updateOne({ nameAr: translatedBody.location.city.toLowerCase() }, { $inc: { numberOfHotel: 1 } });
    if (cityUpdated.modifiedCount === 0) {
        yield city_1.default.create({
            name: translatedBody.location.city,
            nameAr: translatedBody.location.cityAr,
            nameEn: translatedBody.location.cityEn,
            isDangerousPlace,
            numberOfHotel: 1
        });
    }
});
exports.translateToEnLogic = translateToEnLogic;
const translateToArLogic = (body, adminBody) => __awaiter(void 0, void 0, void 0, function* () {
    const translatedBody = yield (0, translateToAr_1.translateToAr)(body);
    const isDangerousPlace = dangerousPlace_1.dangerousPlaces.some(item => { var _a; return item.toLowerCase() === ((_a = body.location.city) === null || _a === void 0 ? void 0 : _a.toLowerCase()); });
    const foundProperty = yield property_1.default.findOne({ "admin._id": adminBody === null || adminBody === void 0 ? void 0 : adminBody._id });
    let newProperty;
    if (foundProperty && foundProperty.isConfirmed === true) {
        newProperty = new property_1.default(Object.assign(Object.assign({}, translatedBody), { admin: adminBody, isDangerousPlace, isConfirmed: true }));
    }
    else {
        newProperty = new property_1.default(Object.assign(Object.assign({}, translatedBody), { admin: adminBody, isActive: false, isDangerousPlace, isConfirmed: false }));
    }
    yield newProperty.save();
    const cityUpdated = yield city_1.default.updateOne({ nameEn: translatedBody.location.city.toLowerCase() }, { $inc: { numberOfHotel: 1 } });
    if (cityUpdated.modifiedCount === 0) {
        yield city_1.default.create({
            name: translatedBody.location.city,
            nameEn: translatedBody.location.cityEn,
            nameAr: translatedBody.location.cityAr,
            isDangerousPlace,
            numberOfHotel: 1
        });
    }
});
exports.translateToArLogic = translateToArLogic;
