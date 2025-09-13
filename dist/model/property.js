"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
    user: {
        _id: { type: mongoose_1.default.Schema.Types.ObjectId },
        name: {
            type: String
        },
        image: {
            type: String
        },
        role: {
            type: String
        },
        email: {
            type: String
        },
        createdAt: {
            type: Date,
            required: true
        }
    },
    data: { type: String },
    dataEn: { type: String },
    dataAr: { type: String },
    rate: { type: Number, min: 1, max: 5 },
}, { timestamps: true });
const adminSchema = new mongoose_1.default.Schema({
    name: String,
    email: String,
    phone: String,
    image: String,
    phoneVerfy: Boolean,
    createdAt: Date
});
const propertySchema = new mongoose_1.default.Schema({
    title: {
        required: true,
        type: String,
        minlength: 3,
        message: "Title is required and it must contain 3 characters"
    },
    titleEn: {
        type: String,
    },
    titleAr: {
        type: String,
    },
    description: {
        required: true,
        type: String,
        minlength: 3,
        message: "Description is required and it must contain 3 characters"
    },
    descriptionEn: {
        type: String,
    },
    descriptionAr: {
        type: String,
    },
    category: {
        type: String,
        required: true,
        enum: ["home", "partment"]
    },
    rate: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    reviews: [reviewSchema],
    admin: adminSchema,
    images: [String],
    nightPrice: {
        type: Number,
        required: true,
        min: 0
    },
    guestNumber: {
        type: Number,
        required: true,
        min: 1
    },
    bathroomNumber: {
        type: Number,
        required: true,
        min: 1
    },
    badroomNumber: {
        type: Number,
        required: true,
        min: 1
    },
    bedNumber: {
        type: Number,
        required: true,
        min: 1
    },
    electricityAndWater: {
        type: Object,
        required: true,
        solar: {
            type: Number,
            required: true,
            min: 0,
            max: 24
        },
        stateElectricity: {
            type: Number,
            required: true,
            min: 0,
            max: 24
        },
        amperes: {
            type: Number,
            required: true,
            min: 0,
            max: 24
        },
        publicWater: {
            type: Number,
            required: true,
            min: 0,
            max: 24
        },
        privateWell: {
            type: Number,
            required: true,
            min: 0,
            max: 24
        },
        waterTank: {
            type: Number,
            required: true,
            min: 0,
            max: 24
        },
    },
    services: [{
            service: { type: String },
            serviceEn: { type: String },
            serviceAr: { type: String },
        }],
    ordersNumbers: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    location: {
        city: { type: String, required: true },
        cityEn: { type: String },
        cityAr: { type: String },
        address: { type: String, required: true },
        addressEn: { type: String },
        addressAr: { type: String },
        coordinates: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true }
        }
    },
    isDangerousPlace: {
        type: Boolean,
        required: true
    },
    isConfirmed: {
        type: Boolean,
        required: true
    },
}, {
    timestamps: true
});
const PropertyModel = mongoose_1.default.model("property", propertySchema);
exports.default = PropertyModel;
