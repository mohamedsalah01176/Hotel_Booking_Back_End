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
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
    verfyCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            let responseServer = yield this.userService.handleVerfyCode(body);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            let responseServer = yield this.userService.handleRegister(body);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            let responseServer = yield this.userService.handleLogin(body);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
    forgetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            let responseServer = yield this.userService.handleForgetPassword(body);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            let responseServer = yield this.userService.handleResetPassword(body);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
    getSpecificUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            let responseServer = yield this.userService.handleGetSpecificUser(user === null || user === void 0 ? void 0 : user._id);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = req.user;
            const body = req.body;
            const pathImage = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
            let responseServer = yield this.userService.handleUpdateUser(user === null || user === void 0 ? void 0 : user._id, Object.assign(Object.assign({}, body), { image: pathImage }));
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let responseServer = yield this.userService.handleGetAllUsers();
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            let responseServer = yield this.userService.handleDeleteUser(userId);
            (0, ResponseStatus_1.ReponseStatues)(responseServer, res);
        });
    }
}
exports.default = UserControler;
