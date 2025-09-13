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
class PropertyController {
    constructor(propertyService) {
        this.propertyService = propertyService;
    }
    allProperty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let responseServer = yield this.propertyService.handleAllProperties();
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
    allActiveProperty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = req.query.limit;
            let responseServer = yield this.propertyService.handleAllActiveProperties(Number(limit));
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
    allActivePropertiesForCity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const cityEn = req.params.cityEn;
            const pageNumber = req.query.pageNumber;
            const limit = req.query.limit;
            let responseServer = yield this.propertyService.handleAllActivePropertiesForCity(cityEn, Number(pageNumber), Number(limit));
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
    specificProperty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const lang = req.query.lang;
            let propertyId = req.params.propertyId;
            let responseServer = yield this.propertyService.handleSpecificProperty(propertyId, lang);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
    addProperty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const lang = req.query.lang || "en";
            const files = req.files;
            const images = files === null || files === void 0 ? void 0 : files.map(file => file.path);
            const adminBody = req.user;
            const body = req.body;
            let responseServer = yield this.propertyService.handleAddProperties(Object.assign(Object.assign({}, body), { images }), adminBody, lang);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
    getPropertyForAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminBody = req.user;
            let responseServer = yield this.propertyService.handleGetPropertyForAdmin(adminBody);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
    updateProperty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const lang = req.query.lang || "en";
            const files = req.files;
            const images = files === null || files === void 0 ? void 0 : files.map(file => file.path);
            const user = req.user;
            const propertyId = req.params.propertyId;
            const body = req.body;
            let responseServer = yield this.propertyService.handleUpdateProperty(Object.assign(Object.assign({}, body), { images }), user, propertyId, lang);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
    DeActiveProperty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const propertyId = req.params.propertyId;
            let responseServer = yield this.propertyService.handleDeActiveProperty(user, propertyId);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
    ActiveProperty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const propertyId = req.params.propertyId;
            let responseServer = yield this.propertyService.handleActiveProperty(user, propertyId);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
    confirmProperty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const propertyId = req.params.propertyId;
            let responseServer = yield this.propertyService.handleConfirmProperty(propertyId);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
    deleteProperty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const propertyId = req.params.propertyId;
            let responseServer = yield this.propertyService.handleDeleteProperty(propertyId);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
}
exports.default = PropertyController;
