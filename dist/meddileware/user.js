"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationForManager = exports.authorizationForUser = exports.authorizationForHost = exports.authentication = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authentication = (req, res, next) => {
    const authHeader = req.headers["Authorization"] || req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(505).json({ message: "No token Providede" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECTERTOKENKEY);
        console.log(decoded);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.authentication = authentication;
const authorizationForHost = (req, res, next) => {
    const authHearder = req.headers["Authorization"] || req.headers["authorization"];
    if (!authHearder || !authHearder.startsWith("Bearer")) {
        return res.status(505).json({ message: "No token Providede" });
    }
    let token = authHearder.split(" ")[1];
    try {
        const decod = jsonwebtoken_1.default.verify(token, process.env.SECTERTOKENKEY);
        console.log(decod);
        if (decod.role == "host") {
            next();
        }
        else {
            return res.status(403).json({ message: "Access denied. Only hosts are allowed." });
        }
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.authorizationForHost = authorizationForHost;
const authorizationForUser = (req, res, next) => {
    const authHearder = req.headers["Authorization"] || req.headers["authorization"];
    if (!authHearder || !authHearder.startsWith("Bearer")) {
        return res.status(505).json({ message: "No token Providede" });
    }
    let token = authHearder.split(" ")[1];
    try {
        const decod = jsonwebtoken_1.default.verify(token, process.env.SECTERTOKENKEY);
        console.log(decod);
        if (decod.role == "user") {
            next();
        }
        else {
            return res.status(403).json({ message: "Access denied. Only hosts are allowed." });
        }
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.authorizationForUser = authorizationForUser;
const authorizationForManager = (req, res, next) => {
    const authHearder = req.headers["Authorization"] || req.headers["authorization"];
    if (!authHearder || !authHearder.startsWith("Bearer")) {
        return res.status(505).json({ message: "No token Providede" });
    }
    let token = authHearder.split(" ")[1];
    try {
        const decod = jsonwebtoken_1.default.verify(token, process.env.SECTERTOKENKEY);
        console.log(decod);
        if (decod.role == "manager") {
            next();
        }
        else {
            return res.status(403).json({ message: "Access denied. Only Manager are allowed." });
        }
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.authorizationForManager = authorizationForManager;
