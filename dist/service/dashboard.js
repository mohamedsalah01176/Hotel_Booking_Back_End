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
const user_1 = __importDefault(require("../model/user"));
const getCoutDashboard_1 = require("../util/getCoutDashboard");
const groupByMonth_1 = require("../util/groupByMonth");
class DashboardService {
    handleGetAnalysisData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reserveDatesMonthly = yield (0, getCoutDashboard_1.getCountsByMonth)(ReservDates_1.ReserveDateModel, "reserveDates");
                const propertiesMonthly = yield (0, getCoutDashboard_1.getCountsByMonth)(property_1.default);
                const usersMonthly = yield (0, getCoutDashboard_1.getCountsByMonth)(user_1.default);
                const reserveDatesDay = yield (0, getCoutDashboard_1.getCountsByDay)(ReservDates_1.ReserveDateModel, "reserveDates");
                const propertiesDay = yield (0, getCoutDashboard_1.getCountsByDay)(property_1.default);
                const usersDay = yield (0, getCoutDashboard_1.getCountsByDay)(user_1.default);
                return {
                    status: "success",
                    data: {
                        reserveDatesMonthly,
                        propertiesMonthly,
                        usersMonthly,
                        reserveDatesDay,
                        propertiesDay,
                        usersDay,
                    },
                };
            }
            catch (errors) {
                return {
                    status: "error",
                    errors,
                };
            }
        });
    }
    handleGetChartData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const now = new Date();
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                const reservations = yield ReservDates_1.ReserveDateModel.find({
                    createdAt: { $gte: startOfYear },
                });
                const users = yield user_1.default.find({
                    createdAt: { $gte: startOfYear },
                });
                const reservationsMonthly = (0, groupByMonth_1.groupByMonth)(reservations, "reserveDates");
                const usersMonthly = (0, groupByMonth_1.groupByMonth)(users, "users");
                const result = [
                    {
                        id: "Reservations",
                        data: Object.keys(reservationsMonthly).map((month) => ({
                            x: month,
                            y: reservationsMonthly[month],
                        })),
                    },
                    {
                        id: "Users",
                        data: Object.keys(usersMonthly).map((month) => ({
                            x: month,
                            y: usersMonthly[month],
                        })),
                    },
                ];
                return {
                    status: "success",
                    data: {
                        result
                    },
                };
            }
            catch (errors) {
                return {
                    status: "error",
                    errors,
                };
            }
        });
    }
    handleGetTopProperty() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const topProperty = yield property_1.default.find({}).sort({ ordersNumbers: -1 }).limit(10);
                return {
                    status: "success",
                    data: {
                        topProperty
                    },
                };
            }
            catch (errors) {
                return {
                    status: "error",
                    errors,
                };
            }
        });
    }
}
exports.default = DashboardService;
