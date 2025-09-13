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
const property_1 = __importDefault(require("../model/property"));
const ReservDates_1 = require("../model/ReservDates");
const yapSchema_1 = require("../util/yapSchema");
class ReservDatesService {
    handleRevesveDates(user, body, propertyId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // if(user.role === "user"){
            //   return{
            //     status:"error",
            //     messageEn:"You are not authorized to perform this action.",
            //     message: "غير مصرح لك بتنفيذ هذا الإجراء"
            //   }
            // }
            try {
                yield yapSchema_1.DateSchema.validate(body);
                const property = yield property_1.default.findOne({ _id: propertyId });
                const foundHotal = yield ReservDates_1.ReserveDateModel.findOne({ propertyId: propertyId });
                if (foundHotal) {
                    yield ReservDates_1.ReserveDateModel.updateOne({ _id: foundHotal._id }, { $push: { reserveDates: Object.assign(Object.assign({}, body), { userId: user._id }) } });
                }
                else {
                    const newReservDate = new ReservDates_1.ReserveDateModel({ reserveDates: Object.assign(Object.assign({}, body), { userId: user._id }), adminId: (_a = property === null || property === void 0 ? void 0 : property.admin) === null || _a === void 0 ? void 0 : _a._id, property, propertyId });
                    yield newReservDate.save();
                }
                yield (property_1.default === null || property_1.default === void 0 ? void 0 : property_1.default.updateOne({ _id: propertyId }, { $inc: { ordersNumbers: 1 } }));
                return {
                    status: "success",
                    message: "Date reserved successfully"
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
    handleGetReserveDateForProperty(propertyId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const foundHotal = yield ReservDates_1.ReserveDateModel.findOne({ propertyId: propertyId });
                if (foundHotal) {
                    return {
                        status: "success",
                        property: foundHotal,
                        nightPrice: (_a = foundHotal.property) === null || _a === void 0 ? void 0 : _a.nightPrice
                    };
                }
                else {
                    const property = yield property_1.default.findOne({ _id: propertyId });
                    return {
                        status: "success",
                        message: "You do not have any reserve date",
                        nightPrice: property === null || property === void 0 ? void 0 : property.nightPrice
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
    handleGetReserveDateForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(userId);
            try {
                const foundHotels = yield ReservDates_1.ReserveDateModel.find({ "reserveDates.userId": userId });
                if (foundHotels.length > 0) {
                    return {
                        status: "success",
                        properties: foundHotels.map(hotel => {
                            var _a;
                            return ({
                                property: hotel.property,
                                nightPrice: (_a = hotel.property) === null || _a === void 0 ? void 0 : _a.nightPrice,
                                reserveDates: hotel.reserveDates.filter(r => r.userId.toString() === userId)
                            });
                        })
                    };
                }
                else {
                    return {
                        status: "success",
                        message: "You do not have any reserve dates"
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
    handleGetAllReserveDate() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const disableDates = yield ReservDates_1.ReserveDateModel.find({});
                return {
                    status: "success",
                    disableDates: disableDates.map((item) => ({
                        propertyId: item.propertyId,
                        disableDates: item.reserveDates
                    }))
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
    handleDeleteRevervedDate(dateId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedHotel = yield ReservDates_1.ReserveDateModel.updateOne({ "reserveDates._id": dateId }, { $pull: { reserveDates: { _id: dateId } } });
                if (deletedHotel.modifiedCount > 0) {
                    return {
                        status: "success",
                        message: "Hotal Deleted"
                    };
                }
                else {
                    return {
                        status: "success",
                        message: "Not Found This Hotal"
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
}
exports.default = ReservDatesService;
