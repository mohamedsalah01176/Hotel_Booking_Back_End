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
exports.PropertyService = void 0;
const city_1 = __importDefault(require("../model/city"));
const property_1 = __importDefault(require("../model/property"));
const translatePropertyLogic_1 = require("../util/Property/translatePropertyLogic");
const translateToAr_1 = require("../util/Property/translateToAr");
const translateToEn_1 = require("../util/Property/translateToEn");
const sendEmail_1 = require("../util/sendEmail");
const yapSchema_1 = require("../util/yapSchema");
class PropertyService {
    handleAllProperties() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const properties = yield property_1.default.find({});
                console.log(properties);
                return {
                    status: "success",
                    properties
                };
            }
            catch (errors) {
                return {
                    status: "error",
                    errors
                };
            }
        });
    }
    handleAllActiveProperties(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const properties = yield property_1.default.find({ isActive: true }).sort({ ordersNumbers: -1 }).limit(limit);
                console.log(properties);
                return {
                    status: "success",
                    properties
                };
            }
            catch (errors) {
                return {
                    status: "error",
                    errors
                };
            }
        });
    }
    handleAllActivePropertiesForCity(cityEn, pageNumber, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(limit);
            console.log(pageNumber);
            const skip = (pageNumber - 1) * limit || 0;
            console.log(cityEn);
            try {
                const allproperties = yield property_1.default.find({ isActive: true, "location.cityEn": cityEn.toLowerCase() });
                const properties = yield property_1.default.find({ isActive: true, "location.cityEn": cityEn.toLowerCase() }).sort({ ordersNumbers: -1 }).skip(skip).limit(limit);
                return {
                    status: "success",
                    properties,
                    numberOfProperties: allproperties.length
                };
            }
            catch (errors) {
                return {
                    status: "error",
                    errors
                };
            }
        });
    }
    handleSpecificProperty(propertyId, lang) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const property = yield property_1.default.findOne({ _id: propertyId }).lean();
                const properties = yield property_1.default.find({ "admin._id": (_a = property === null || property === void 0 ? void 0 : property.admin) === null || _a === void 0 ? void 0 : _a._id }).lean();
                let lengthOfAllReviewsForHost = properties.reduce((acc, item) => acc + item.reviews.length, 0);
                let totalRatingForHost = properties.reduce((acc, item) => { var _a; return acc + (((_a = item.reviews) === null || _a === void 0 ? void 0 : _a.reduce((acc2, review) => acc2 + (review.rate || 0), 0)) || 0); }, 0);
                const rotalRatingPercentageForHost = lengthOfAllReviewsForHost > 0 ? totalRatingForHost / lengthOfAllReviewsForHost : 0;
                if (property) {
                    return {
                        status: "success",
                        property: Object.assign(Object.assign({}, property), { allReviews: lengthOfAllReviewsForHost, rotalRatingPercentage: rotalRatingPercentageForHost })
                    };
                }
                else {
                    return {
                        status: "fail",
                        message: "Property Not Found"
                    };
                }
            }
            catch (errors) {
                return {
                    status: "error",
                    errors
                };
            }
        });
    }
    handleAddProperties(body, adminBody, lang) {
        return __awaiter(this, void 0, void 0, function* () {
            if (adminBody.role === "user") {
                return {
                    status: "fail",
                    message: "Access denied. Only hosts can perform this action."
                };
            }
            try {
                body.electricityAndWater.solar = Number(body.electricityAndWater.solar);
                body.electricityAndWater.stateElectricity = Number(body.electricityAndWater.stateElectricity);
                body.electricityAndWater.amperes = Number(body.electricityAndWater.amperes);
                body.electricityAndWater.publicWater = Number(body.electricityAndWater.publicWater);
                body.electricityAndWater.privateWell = Number(body.electricityAndWater.privateWell);
                body.electricityAndWater.waterTank = Number(body.electricityAndWater.waterTank);
                console.log(body);
                const validbody = yield yapSchema_1.propertySchema.validate(body, { abortEarly: false });
                if (lang === "ar") {
                    yield (0, translatePropertyLogic_1.translateToEnLogic)(body, adminBody);
                }
                else {
                    yield (0, translatePropertyLogic_1.translateToArLogic)(body, adminBody);
                }
                return {
                    status: "success",
                    message: "Your property has been submitted and is waiting for manager review."
                };
            }
            catch (errors) {
                return {
                    status: "error",
                    errors
                };
            }
        });
    }
    handleGetPropertyForAdmin(adminBody) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(adminBody);
            if (adminBody.role === "user") {
                return {
                    status: "fail",
                    message: "Access denied. Only hosts can perform this action."
                };
            }
            try {
                const foundProperts = yield property_1.default.find({ "admin._id": adminBody._id });
                if (foundProperts.length > 0) {
                    return {
                        status: "success",
                        properties: foundProperts
                    };
                }
                else {
                    return {
                        status: "success",
                        message: "This admin have not any properties"
                    };
                }
            }
            catch (errors) {
                return {
                    status: "error",
                    errors
                };
            }
        });
    }
    handleUpdateProperty(body, user, propertyId, lang) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (user.role === "user") {
                    return {
                        status: "fail",
                        message: "Access denied. Only hosts can perform this action."
                    };
                }
                const foundProperty = yield property_1.default.findOne({ _id: propertyId });
                if (!foundProperty) {
                    return {
                        status: "fail",
                        message: "This Property is not found"
                    };
                }
                if (lang === "ar") {
                    const translatedBody = yield (0, translateToEn_1.translateToEn)(body);
                    foundProperty.set(translatedBody);
                    yield foundProperty.save();
                }
                else {
                    const translatedBody = yield (0, translateToAr_1.translateToAr)(body);
                    foundProperty.set(translatedBody);
                    yield foundProperty.save();
                }
                return {
                    status: "success",
                    message: "Property updated successfully",
                    data: foundProperty,
                };
            }
            catch (errors) {
                return {
                    status: "error",
                    errors
                };
            }
        });
    }
    handleDeActiveProperty(user, propertyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (user.role === "user") {
                    return {
                        status: "fail",
                        message: "Access denied. Only hosts can perform this action."
                    };
                }
                const foundProperty = yield property_1.default.findByIdAndUpdate(propertyId, { $set: { isActive: false } }, { new: true });
                if (!foundProperty) {
                    return {
                        status: "fail",
                        message: "This property was not found",
                    };
                }
                (0, sendEmail_1.sendEmailDeactivatedProperty)(foundProperty.titleEn, user.email);
                (0, sendEmail_1.sendEmailDeactivatedProperty)(foundProperty.titleEn, process.env.AUTHEMAIL);
                return {
                    status: "success",
                    message: "Property is Stoped"
                };
            }
            catch (errors) {
                return {
                    status: "error",
                    errors
                };
            }
        });
    }
    handleActiveProperty(user, propertyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (user.role === "user") {
                    return {
                        status: "fail",
                        message: "Access denied. Only hosts can perform this action."
                    };
                }
                const foundProperty = yield property_1.default.findByIdAndUpdate(propertyId, { $set: { isActive: true } });
                if (!foundProperty) {
                    return {
                        status: "fail",
                        message: "This Property is not found"
                    };
                }
                (0, sendEmail_1.sendEmailActivatedProperty)(foundProperty.titleEn, user.email);
                (0, sendEmail_1.sendEmailActivatedProperty)(foundProperty.titleEn, process.env.AUTHEMAIL);
                return {
                    status: "success",
                    message: "Property is Active"
                };
            }
            catch (errors) {
                return {
                    status: "error",
                    errors
                };
            }
        });
    }
    handleConfirmProperty(propertyId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const foundProperty = yield property_1.default.findOne({ _id: propertyId });
                if (!foundProperty) {
                    return {
                        status: "fail",
                        message: "This Property is not found"
                    };
                }
                foundProperty.set({ isConfirmed: true });
                foundProperty.save();
                (0, sendEmail_1.sendEmailCreatedProperty)(foundProperty === null || foundProperty === void 0 ? void 0 : foundProperty.title, (_a = foundProperty === null || foundProperty === void 0 ? void 0 : foundProperty.admin) === null || _a === void 0 ? void 0 : _a.email);
                return {
                    status: "success",
                    message: "Property is confirmed"
                };
            }
            catch (errors) {
                return {
                    status: "error",
                    errors
                };
            }
        });
    }
    handleDeleteProperty(propertyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedProperty = yield property_1.default.findByIdAndDelete(propertyId);
                if (!deletedProperty) {
                    return {
                        status: "fail",
                        message: "This property was not found"
                    };
                }
                yield city_1.default.updateOne({ nameEn: deletedProperty.location.cityEn }, { $inc: { numberOfHotel: -1 } });
                (0, sendEmail_1.sendEmailManagerDeletedProperty)(deletedProperty.titleEn, deletedProperty.admin.email);
                return {
                    status: "success",
                    message: "Property has been deleted"
                };
            }
            catch (errors) {
                return {
                    status: "error",
                    errors
                };
            }
        });
    }
}
exports.PropertyService = PropertyService;
