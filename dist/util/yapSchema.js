"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateSchema = exports.propertySchema = exports.testFunction = exports.forgetPasswordBodySchema = exports.loginBodySchema = exports.regiterBodySchema = void 0;
const yup = __importStar(require("yup"));
exports.regiterBodySchema = yup.object({
    name: yup.string().min(3, 'Password must be at least 3 characters').required('Name is required'),
    phone: yup.string().required('Phone is required'),
    email: yup.string().email("Email Not Valid").required('Email is required'),
    password: yup.string().matches(/^(?=.*[a-zA-Z])(?=.*\d)/, 'Password must contain at least one letter and one number').required('Password is required'),
    role: yup.string().oneOf(['user', 'host', 'manager'], "This Not Valid"),
    birthDate: yup.date().optional()
});
exports.loginBodySchema = yup.object({
    emailOrPhone: yup.string().test("email-or-phone", "Invalid Phone Number Or Email", (value) => (0, exports.testFunction)(value)).required('Email is required Or Phone'),
    password: yup.string().matches(/^(?=.*[a-zA-Z])(?=.*\d)/, 'Password must contain at least one letter and one number').required('Password is required'),
});
exports.forgetPasswordBodySchema = yup.object({
    password: yup.string().matches(/^(?=.*[a-zA-Z])(?=.*\d)/, 'Password must contain at least one letter and one number').required('Password is required'),
});
const emailRGX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRGX = /^\+?[1-9]\d{6,14}$/;
const testFunction = (value) => {
    return phoneRGX.test(value) || emailRGX.test(value);
};
exports.testFunction = testFunction;
exports.propertySchema = yup.object({
    title: yup.string().required("Title is required").min(3, "Title must be at least 3 characters"),
    description: yup.string().required("Description is required").min(3, "Title must be at least 3 characters"),
    category: yup.string().required("Category is required").oneOf(["home", "partment"], "Invalid category"),
    guestNumber: yup.number().required("Gest Number is required").min(1, "At least one guest is required"),
    bathroomNumber: yup.number().required("Bathroom Number is required").min(1, "At least one guest is required"),
    badroomNumber: yup.number().required("Badroom Number is required").min(1, "At least one guest is required"),
    bedNumber: yup.number().required("Bed Number is required").min(1, "At least one guest is required"),
    services: yup.array().of(yup.string()).min(1, "At least one service is required"),
    reviews: yup.array().of(yup.string()),
    images: yup.array().min(1, "At least one service is required"),
    location: yup.object({
        city: yup.string().required("City is required"),
        address: yup.string().required("Adress is required"),
        coordinates: yup.object({
            lat: yup.number().required("Latitude is required"),
            lng: yup.number().required("Longitude is required"),
        })
    }).required("Location is required")
});
exports.DateSchema = yup.object({
    dates: yup.array().of(yup.date().required()).required("date is required").min(1, "At least one dates are required"),
});
