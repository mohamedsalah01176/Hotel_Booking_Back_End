"use strict";
// import twilio from "twilio";
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
const axios_1 = __importDefault(require("axios"));
function sendMessageSMS(code, userPhone) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const from = process.env.VONAGE_API_PHONE; // your approved sender/virtual number
            const to = "4368864870135"; // E.164 format like "+4368864870135"
            const text = `Your OTP code is: ${code}`;
            const payload = new URLSearchParams({
                api_key: process.env.VONAGE_API_KEY,
                api_secret: process.env.VONAGE_API_SECRET,
                to,
                from: 'VonageTest',
                text
            }).toString();
            const url = 'https://rest.nexmo.com/sms/json';
            const response = yield axios_1.default.post(url, payload, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            console.log('Message sent successfully');
            console.log(response.data);
            return { status: 'success' };
        }
        catch (err) {
            console.error('There was an error sending the messages.');
            console.error(err);
            return { status: 'error', errors: err };
        }
    });
}
// export async function sendMessageSMS(code: number, userPhone: string) {
//   console.log(process.env.VONAGE_API_KEY)
//   console.log(process.env.VONAGE_API_SECRET)
//   console.log(process.env.VONAGE_API_PHONE)
//   try {
//     const from = "Vonage APIs"
//     const to = "4368864870135"
//     const text = 'A text message sent using the Vonage SMS API'
//     const resp="sssss"
//     async function sendSMS() {
//         await vonage.sms.send({to, from, text})
//             .then((resp: any) => { console.log('Message sent successfully'); console.log(resp); })
//             .catch((err: any) => { console.log('There was an error sending the messages.'); console.error(err); });
//     }
//     sendSMS();
//     // Twilio (اختياري)
//     // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
//     // const message = await client.messages.create({
//     //   body: `Your OTP code is: ${code}`,
//     //   from: process.env.TWILIO_PHONE_NUMBER,
//     //   to: userPhone,
//     // });
//     // console.log("✅ SMS sent via Twilio:", message);
//     return { status: "success", resp };
//   } catch (errors) {
//     console.error("❌ Error sending SMS:", errors);
//     return { status: "error", errors };
//   }
// }
function sendMessageWhatsUp(code, userPhone) {
    return __awaiter(this, void 0, void 0, function* () {
        const to = "4368864870135"; // E.164 format like "+4368864870135"
        const text = `Your OTP code is: ${code}`;
        const url = 'https://messages-vonage-compute.api.nexmo.com/v0.1/messages';
        const data = {
            from: { type: "whatsapp", number: process.env.WHATSAPP_NUMBER }, // رقم WhatsApp المسجل
            to: { type: "whatsapp", number: to },
            message: { content: { type: "text", text: text } }
        };
        const headers = {
            'Authorization': `Bearer ${process.env.VONAGE_API_KEY}:${process.env.VONAGE_API_SECRET}`,
            'Content-Type': 'application/json'
        };
        try {
            const response = yield axios_1.default.post(url, data, { headers });
            console.log('WhatsApp message sent:', response.data);
        }
        catch (error) {
            console.error("❌ Twilio error:", (error === null || error === void 0 ? void 0 : error.message) || error);
            return { status: "error", error };
        }
    });
}
// export async function sendMessageWhatsUp(code: number, userPhone: string) {
//   const client=twilio(process.env.TWILIO_ACCOUNT_SID , process.env.TWILIO_AUTH_TOKEN  );
//   console.log("➡️ Starting WhatsApp send…");
//   try {
//     const message = await client.messages.create({
//       body: `Your OTP code is: ${code}`,
//       from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
//       to:   `whatsapp:${userPhone}`
//     });
//     console.log("✅ Sent! SID:", message.sid); // سيظهر هذا عند النجاح
//     return { status: "success", sid: message.sid };
//   } catch (error: any) {
//     console.error("❌ Twilio error:", error?.message || error);
//     return { status: "error", error };
//   }
// }
