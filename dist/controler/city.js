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
class CityController {
    constructor(cityService) {
        this.cityService = cityService;
    }
    allCities(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let responseServer = yield this.cityService.handleGetCities();
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
    deleteCity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const cityName = req.params.cityName;
            let responseServer = yield this.cityService.handleDeleteCities(cityName);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
    updateCity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const cityName = req.params.cityName;
            const body = req.body;
            let responseServer = yield this.cityService.handleUpdateCities(cityName, body);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
}
exports.default = CityController;
