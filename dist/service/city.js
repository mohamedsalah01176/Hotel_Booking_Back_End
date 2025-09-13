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
const city_1 = __importDefault(require("../model/city"));
const property_1 = __importDefault(require("../model/property"));
const translateToAr_1 = require("../util/City/translateToAr");
class CityService {
    handleGetCities() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cities = yield city_1.default.find({});
                return {
                    status: "success",
                    cities
                };
            }
            catch (errors) {
                return {
                    status: "error",
                    errors
                };
            }
        });
    }
    handleDeleteCities(cityName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(cityName);
                const cities = yield city_1.default.deleteOne({ nameEn: cityName });
                console.log(cities);
                if (cities.deletedCount > 0) {
                    yield property_1.default.deleteMany({ "location.cityEn": cityName });
                    return {
                        status: "success",
                        cities
                    };
                }
                else {
                    return {
                        status: "fail",
                        message: "Not Found Any City"
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
    handleUpdateCities(cityName, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const translateBody = yield (0, translateToAr_1.translateToAr)(body);
                const cities = yield city_1.default.updateOne({ nameEn: cityName }, { $set: Object.assign(Object.assign({}, body), translateBody) });
                if (cities.modifiedCount > 0) {
                    yield property_1.default.updateMany({ "location.cityEn": cityName }, { $set: { isDangerousPlace: body.isDangerousPlace, "location.city": cityName, "location.cityEn": translateBody.nameEn, "location.cityAr": translateBody.nameAr } });
                    return {
                        status: "success",
                        cities
                    };
                }
                else {
                    return {
                        status: "fail",
                        message: "Not Found Any City"
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
exports.default = CityService;
