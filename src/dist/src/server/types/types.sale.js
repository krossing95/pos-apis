"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesPeriodTabFilter = exports.SalesPeriod = exports.PaymentMethod = exports.SaleStatus = void 0;
var SaleStatus;
(function (SaleStatus) {
    SaleStatus["PAID"] = "paid";
    SaleStatus["UNPAID"] = "unpaid";
    SaleStatus["FAILED"] = "failed";
    SaleStatus["CANCELLED"] = "cancelled";
    SaleStatus["ALL"] = "";
})(SaleStatus || (exports.SaleStatus = SaleStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "cash";
    PaymentMethod["CARD"] = "card";
    PaymentMethod["MOBILE_MONEY"] = "mobile_money";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var SalesPeriod;
(function (SalesPeriod) {
    SalesPeriod["TODAY"] = "today";
    SalesPeriod["YESTERDAY"] = "yesterday";
    SalesPeriod["THIS_WEEK"] = "this_week";
    SalesPeriod["LAST_7_DAYS"] = "last_7_days";
    SalesPeriod["LAST_30_DAYS"] = "last_30_days";
    SalesPeriod["THIS_MONTH"] = "this_month";
    SalesPeriod["LAST_MONTH"] = "last_month";
    SalesPeriod["THIS_YEAR"] = "this_year";
})(SalesPeriod || (exports.SalesPeriod = SalesPeriod = {}));
var SalesPeriodTabFilter;
(function (SalesPeriodTabFilter) {
    SalesPeriodTabFilter["12-months"] = "12-months";
    SalesPeriodTabFilter["30-days"] = "30-days";
    SalesPeriodTabFilter["7-days"] = "7-days";
    SalesPeriodTabFilter["24-hours"] = "24-hours";
})(SalesPeriodTabFilter || (exports.SalesPeriodTabFilter = SalesPeriodTabFilter = {}));
