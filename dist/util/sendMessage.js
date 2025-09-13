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
exports.sendMessageSMS = sendMessageSMS;
exports.sendMessageWhatsUp = sendMessageWhatsUp;
const twilio_1 = __importDefault(require("twilio"));
function sendMessageSMS(code, userPhone) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        try {
            const message = yield client.messages.create({
                body: `Your OTP code is: ${code}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: userPhone
            });
        }
        catch (errors) {
            return {
                status: "error",
                errors
            };
        }
    });
}
function sendMessageWhatsUp(code, userPhone) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        console.log("➡️ Starting WhatsApp send…");
        try {
            const message = yield client.messages.create({
                body: `Your OTP code is: ${code}`,
                from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
                to: `whatsapp:${userPhone}`
            });
            console.log("✅ Sent! SID:", message.sid); // سيظهر هذا عند النجاح
            return { status: "success", sid: message.sid };
        }
        catch (error) {
            console.error("❌ Twilio error:", (error === null || error === void 0 ? void 0 : error.message) || error);
            return { status: "error", error };
        }
    });
}
