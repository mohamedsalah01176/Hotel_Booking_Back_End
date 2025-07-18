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
class UserControler {
    constructor(userService) {
        this.userService = userService;
    }
    sendCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            let responseServer = yield this.userService.handleSendCode(body);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, req, res);
        });
    }
    verfyCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            let responseServer = yield this.userService.handleVerfyCode(body);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, req, res);
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            let responseServer = yield this.userService.handleRegister(body);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, req, res);
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            let responseServer = yield this.userService.handleLogin(body);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, req, res);
        });
    }
    forgetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            let responseServer = yield this.userService.handleForgetPassword(body);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, req, res);
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            let responseServer = yield this.userService.handleResetPassword(body);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, req, res);
        });
    }
}
exports.default = UserControler;
