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
class ReservDatesController {
    constructor(reverveDateService) {
        this.reverveDateService = reverveDateService;
    }
    revesveDates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const body = req.body;
            const propertyId = req.params.propertyId;
            const responseServicer = yield this.reverveDateService.handleRevesveDates(user, body, propertyId);
            (0, ResponseStatus_1.ReponseStatues)(responseServicer, res);
        });
    }
    getReserveDateForProperty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const propertyId = req.params.propertyId;
            const responseServicer = yield this.reverveDateService.handleGetReserveDateForProperty(propertyId);
            (0, ResponseStatus_1.ReponseStatues)(responseServicer, res);
        });
    }
    getReserveDateForUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req === null || req === void 0 ? void 0 : req.user;
            const responseServicer = yield this.reverveDateService.handleGetReserveDateForUser(userId._id);
            (0, ResponseStatus_1.ReponseStatues)(responseServicer, res);
        });
    }
    getAllReserveDate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseServicer = yield this.reverveDateService.handleGetAllReserveDate();
            (0, ResponseStatus_1.ReponseStatues)(responseServicer, res);
        });
    }
    deleteRevervedDate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dateId = req.params.dateId;
            const user = req.user;
            const responseServicer = yield this.reverveDateService.handleDeleteRevervedDate(dateId, user);
            (0, ResponseStatus_1.ReponseStatues)(responseServicer, res);
        });
    }
}
exports.default = ReservDatesController;
