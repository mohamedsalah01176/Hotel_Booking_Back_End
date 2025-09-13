"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReserveDateModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    reserveDates: [{
            dates: {
                type: [Date],
                required: true,
            },
            userId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
    adminId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    propertyId: {
        type: String,
        required: true
    },
    property: {
        type: Object,
        // ref: "Property",
        required: true
    }
}, {
    timestamps: true
});
exports.ReserveDateModel = mongoose_1.default.model("reservDate", schema);
