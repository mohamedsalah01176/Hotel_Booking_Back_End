"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudnary_1 = __importDefault(require("../util/cloudnary"));
const multer_1 = __importDefault(require("multer"));
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudnary_1.default,
    params: () => {
        return {
            folder: "property-images",
            allowed_formats: ["jpg", "png", "jpeg", "webp"],
        };
    }
});
const upload = (0, multer_1.default)({ storage });
exports.default = upload;
