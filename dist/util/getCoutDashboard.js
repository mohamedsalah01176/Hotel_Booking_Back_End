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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCountsByDay = exports.getCountsByMonth = void 0;
const getCountsByMonth = (Model, path) => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    let currentCount = 0;
    let previousCount = 0;
    if (path) {
        const docs = yield Model.find({
            $or: [
                { [`${path}.createdAt`]: { $gte: startOfThisMonth } },
                {
                    [`${path}.createdAt`]: {
                        $gte: startOfLastMonth,
                        $lte: endOfLastMonth,
                    },
                },
            ],
        }, { [path]: 1 });
        docs.forEach((doc) => {
            doc[path].forEach((item) => {
                if (item.createdAt >= startOfThisMonth)
                    currentCount++;
                if (item.createdAt >= startOfLastMonth && item.createdAt <= endOfLastMonth)
                    previousCount++;
            });
        });
        console.log(currentCount);
        console.log(previousCount);
    }
    else {
        currentCount = yield Model.countDocuments({ createdAt: { $gte: startOfThisMonth } });
        previousCount = yield Model.countDocuments({
            createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
        });
    }
    let percentageChange = 0;
    if (previousCount > 0) {
        percentageChange = ((currentCount - previousCount) / previousCount) * 100;
    }
    else if (previousCount === 0 && currentCount > 0) {
        percentageChange = 100;
    }
    return {
        numbers: currentCount,
        percentageChange: percentageChange.toFixed(2) + "%",
    };
});
exports.getCountsByMonth = getCountsByMonth;
const getCountsByDay = (Model, path) => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const endOfYesterday = new Date(startOfToday);
    let currentCount = 0;
    let previousCount = 0;
    if (path) {
        const docs = yield Model.find({
            $or: [
                { [`${path}.createdAt`]: { $gte: startOfToday, $lt: endOfToday } },
                { [`${path}.createdAt`]: { $gte: startOfYesterday, $lt: endOfYesterday } },
            ],
        }, { [path]: 1 });
        docs.forEach((doc) => {
            doc[path].forEach((item) => {
                if (item.createdAt >= startOfToday && item.createdAt < endOfToday)
                    currentCount++;
                if (item.createdAt >= startOfYesterday && item.createdAt < endOfYesterday)
                    previousCount++;
            });
        });
    }
    else {
        currentCount = yield Model.countDocuments({
            createdAt: { $gte: startOfToday, $lt: endOfToday },
        });
        previousCount = yield Model.countDocuments({
            createdAt: { $gte: startOfYesterday, $lt: endOfYesterday },
        });
    }
    let percentageChange = 0;
    if (previousCount > 0) {
        percentageChange = ((currentCount - previousCount) / previousCount) * 100;
    }
    else if (previousCount === 0 && currentCount > 0) {
        percentageChange = 100;
    }
    return {
        numbers: currentCount,
        percentageChange: percentageChange.toFixed(2) + "%",
    };
});
exports.getCountsByDay = getCountsByDay;
