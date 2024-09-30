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
const types_sale_1 = require("../../types/types.sale");
const config_db_1 = require("../../config/config.db");
const model_organization_1 = __importDefault(require("../../models/model.organization"));
const model_sale_1 = __importDefault(require("../../models/model.sale"));
const helper_index_1 = require("../../helpers/helper.index");
const GetSaleAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        (0, config_db_1.connectToDB)();
        // Check if organization exists
        const organization = yield model_organization_1.default.findById(payload.organizationId).populate("products");
        if (!organization)
            return res
                .status(412)
                .json({ message: "Organization not found", code: "412", data: {} });
        // Find sales made by the organization today, this week, this month and this year
        const today = new Date();
        const startOfToday = new Date(today.setHours(0, 0, 0, 0));
        const endOfToday = new Date(today.setHours(23, 59, 59, 999));
        const yesterday = new Date(today.setDate(new Date().getDate() - 1));
        const startOfYesterday = new Date(yesterday.setHours(0, 0, 0, 0));
        const endOfYesterday = new Date(yesterday.setHours(23, 59, 59, 999));
        const startOfThisWeek = new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).setHours(0, 0, 0, 0);
        const startOfLastWeek = new Date(today.setDate(today.getDate() - 7)).setHours(0, 0, 0, 0);
        const endOfThisWeek = new Date(startOfThisWeek);
        const endOfLastWeek = new Date(startOfLastWeek);
        endOfThisWeek.setDate(endOfThisWeek.getDate() + 6);
        endOfLastWeek.setDate(endOfLastWeek.getDate() + 6);
        const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfThisMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        const startOfThisYear = new Date(today.getFullYear(), 0, 1);
        const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
        const endOfThisYear = new Date(today.getFullYear(), 11, 31);
        const endOfLastYear = new Date(today.getFullYear() - 1, 11, 31);
        // Create an initial query object to filter orders.
        const query = {
            organization: organization._id,
            status: payload.status || { $ne: types_sale_1.SaleStatus.CANCELLED },
        };
        const sales = yield model_sale_1.default.find(query);
        const totalSalesAmount = sales.reduce((sum, sale) => sum + sale.amount, 0);
        const totalSales = sales.length;
        const todaySales = yield model_sale_1.default.find(Object.assign({ paidAt: { $gte: startOfToday, $lte: endOfToday } }, query));
        const yesterdaySales = yield model_sale_1.default.find(Object.assign({ paidAt: { $gte: startOfYesterday, $lte: endOfYesterday } }, query));
        const thisWeekSales = yield model_sale_1.default.find(Object.assign({ paidAt: { $gte: startOfThisWeek, $lte: endOfThisWeek } }, query));
        const lastWeekSales = yield model_sale_1.default.find(Object.assign({ paidAt: { $gte: startOfLastWeek, $lte: endOfLastWeek } }, query));
        const thisMonthSales = yield model_sale_1.default.find(Object.assign({ paidAt: { $gte: startOfThisMonth, $lte: endOfThisMonth } }, query));
        const lastMonthSales = yield model_sale_1.default.find(Object.assign({ paidAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }, query));
        const thisYearSales = yield model_sale_1.default.find(Object.assign({ paidAt: { $gte: startOfThisYear, $lte: endOfThisYear } }, query));
        const lastYearSales = yield model_sale_1.default.find(Object.assign({ paidAt: { $gte: startOfLastYear, $lte: endOfLastYear } }, query));
        const totalSalesAmountForToday = todaySales.reduce((sum, sale) => sum + sale.amount, 0);
        const totalSalesAmountForYesterday = yesterdaySales.reduce((sum, sale) => sum + sale.amount, 0);
        const totalSalesAmountForThisWeek = thisWeekSales.reduce((sum, sale) => sum + sale.amount, 0);
        const totalSalesAmountForLastWeek = lastWeekSales.reduce((sum, sale) => sum + sale.amount, 0);
        const totalSalesAmountForThisMonth = thisMonthSales.reduce((sum, sale) => sum + sale.amount, 0);
        const totalSalesAmountForLastMonth = lastMonthSales.reduce((sum, sale) => sum + sale.amount, 0);
        const totalSalesAmountForThisYear = thisYearSales.reduce((sum, sale) => sum + sale.amount, 0);
        const totalSalesAmountForLastYear = lastYearSales.reduce((sum, sale) => sum + sale.amount, 0);
        //get percentage increase or decrease in sales for today
        const percentageIncreaseOrDecreaseForToday = (0, helper_index_1.calculatePercentageChange)(totalSalesAmountForToday, totalSalesAmountForYesterday);
        //get percentage increase or decrease in sales for this week
        const percentageIncreaseOrDecreaseForThisWeek = (0, helper_index_1.calculatePercentageChange)(totalSalesAmountForThisWeek, totalSalesAmountForLastWeek);
        //get percentage increase or decrease in sales for this month
        const percentageIncreaseOrDecreaseForThisMonth = (0, helper_index_1.calculatePercentageChange)(totalSalesAmountForThisMonth, totalSalesAmountForLastMonth);
        //get percentage increase or decrease in sales for this year
        const percentageIncreaseOrDecreaseForThisYear = (0, helper_index_1.calculatePercentageChange)(totalSalesAmountForThisYear, totalSalesAmountForLastYear);
        //GET HOURLY SALES
        const startOfDay = new Date();
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(startOfDay);
        endOfDay.setUTCHours(23, 59, 59, 999);
        const salesPerHourOfTheDay = yield model_sale_1.default.aggregate([
            {
                // Filter sales made today and not deleted
                $match: Object.assign({ createdAt: {
                        $gte: startOfDay,
                        $lt: endOfDay,
                    }, isDeleted: false }, query),
            },
            {
                // Group by hour of the day and sum the amount
                $group: {
                    _id: {
                        hour: { $hour: "$paidAt" },
                    },
                    value: { $sum: "$amount" },
                },
            },
            {
                $project: {
                    _id: 0,
                    label: "$_id.hour",
                    value: 1,
                },
            },
            {
                $sort: { label: 1 },
            },
        ]);
        const hourlySales = [];
        for (let hour = 0; hour < 24; hour++) {
            const label = new Date(startOfDay);
            label.setUTCHours(hour);
            const sale = salesPerHourOfTheDay.find((sale) => new Date(new Date().setHours(sale.label)).setMinutes(0, 0, 0) ===
                label.setMinutes(0, 0, 0));
            hourlySales.push({
                label: label.toISOString(),
                value: sale ? sale.value : 0,
            });
        }
        //END GET HOURLY SALES
        //GET SALES PER DAY OF WEEK
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setUTCDate(now.getUTCDate() - now.getUTCDay());
        startOfWeek.setUTCHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
        endOfWeek.setUTCHours(23, 59, 59, 999);
        const salesPerDayOfWeek = yield model_sale_1.default.aggregate([
            {
                $match: Object.assign({ createdAt: {
                        $gte: startOfWeek,
                        $lt: endOfWeek,
                    }, isDeleted: false }, query),
            },
            {
                $group: {
                    _id: {
                        day: { $dayOfYear: "$paidAt" },
                        year: { $year: "$paidAt" },
                    },
                    value: { $sum: "$amount" },
                    label: { $first: "$paidAt" },
                },
            },
            {
                // Group by day of the week and sum the amount
                // $group uses the label key below to group by day of the week by grabbing the label above which is the date
                $project: {
                    _id: 0,
                    label: "$label",
                    value: 1,
                },
            },
            {
                $sort: { label: 1 },
            },
        ]);
        const salesPerDayOfWeekResults = [];
        for (let day = 0; day < 7; day++) {
            const label = new Date(startOfWeek);
            label.setUTCDate(startOfWeek.getUTCDate() + day);
            const sale = salesPerDayOfWeek.find((sale) => new Date(sale.label).setUTCHours(0, 0, 0, 0) ===
                label.setUTCHours(0, 0, 0, 0));
            salesPerDayOfWeekResults.push({
                label: label.toISOString(),
                value: sale ? sale.value : 0,
            });
        }
        //END GET SALES PER DAY OF WEEK
        //GET SALES PER WEEK OF MONTH
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
        const salesPerWeekOfMonth = yield model_sale_1.default.aggregate([
            {
                $match: Object.assign({ createdAt: {
                        $gte: startOfMonth,
                        $lt: endOfMonth,
                    }, isDeleted: false }, query),
            },
            {
                $group: {
                    _id: {
                        week: { $week: "$paidAt" },
                        year: { $year: "$paidAt" },
                    },
                    value: { $sum: "$amount" },
                    label: { $first: "$paidAt" },
                },
            },
            {
                // Group by day of the week and sum the amount
                // $group uses the label key below to group by day of the week by grabbing the label above which is the date
                $project: {
                    _id: 0,
                    label: "$label",
                    value: 1,
                },
            },
            {
                $sort: { label: 1 },
            },
        ]);
        const salesPerWeekOfMonthResults = [];
        for (let week = 0; week < 4; week++) {
            const label = new Date(startOfMonth);
            label.setUTCDate(startOfMonth.getUTCDate() + week * 7);
            const sale = salesPerWeekOfMonth.find((sale) => (0, helper_index_1.getWeekNumberInMonth)(new Date(sale.label)) ===
                (0, helper_index_1.getWeekNumberInMonth)(label));
            salesPerWeekOfMonthResults.push({
                label: label.toISOString(),
                value: sale ? sale.value : 0,
            });
        }
        //END GET SALES PER WEEK OF MONTH
        //GET SALES PER MONTH OF YEAR
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear(), 11, 31);
        const salesPerMonthOfYear = yield model_sale_1.default.aggregate([
            {
                $match: Object.assign({ createdAt: {
                        $gte: startOfYear,
                        $lt: endOfYear,
                    }, isDeleted: false }, query),
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$paidAt" },
                        year: { $year: "$paidAt" },
                    },
                    value: { $sum: "$amount" },
                    label: { $first: "$paidAt" },
                },
            },
            {
                // Group by day of the week and sum the amount
                // $group uses the label key below to group by day of the week by grabbing the label above which is the date
                $project: {
                    _id: 0,
                    label: "$label",
                    value: 1,
                },
            },
            {
                $sort: { label: 1 },
            },
        ]);
        const salesPerMonthOfYearResults = [];
        for (let month = 0; month < 12; month++) {
            const label = new Date(now.getFullYear(), month, 1);
            const sale = salesPerMonthOfYear.find((sale) => new Date(sale.label).getMonth() === label.getMonth());
            salesPerMonthOfYearResults.push({
                label: label.toISOString(),
                value: sale ? sale.value : 0,
            });
        }
        //END GET SALES PER MONTH OF YEAR
        return res.status(200).json({
            message: "",
            code: "200",
            data: Object.assign({}, (0, helper_index_1.parseApiResults)({
                sales: [],
                totalSales: totalSales,
                totalSalesAmount: totalSalesAmount,
                totalSalesAmountForToday,
                totalSalesAmountForThisWeek,
                totalSalesAmountForThisMonth,
                totalSalesAmountForThisYear,
                salesPerHour: hourlySales,
                salesPerDayOfWeek: salesPerDayOfWeekResults,
                salesPerWeekOfMonth: salesPerWeekOfMonthResults,
                salesPerMonthOfYear: salesPerMonthOfYearResults,
                percentageIncreaseOrDecreaseForToday,
                percentageIncreaseOrDecreaseForThisWeek,
                percentageIncreaseOrDecreaseForThisMonth,
                percentageIncreaseOrDecreaseForThisYear,
            })),
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Whoops! Something went wrong",
            code: "500",
            data: {},
        });
    }
});
exports.default = GetSaleAnalytics;
