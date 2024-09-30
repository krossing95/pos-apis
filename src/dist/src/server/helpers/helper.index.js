"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseApiResults = parseApiResults;
exports.calculatePercentageChange = calculatePercentageChange;
exports.getWeekNumberInMonth = getWeekNumberInMonth;
exports.extractNameFromEmail = extractNameFromEmail;
function parseApiResults(results) {
    return JSON.parse(JSON.stringify(results));
}
function calculatePercentageChange(currentValue, previousValue) {
    // return 0 if previous value is 0
    if (previousValue === 0)
        return 0;
    const change = currentValue - previousValue;
    const percentageChange = (change / previousValue) * 100;
    return Math.round(percentageChange);
}
function getWeekNumberInMonth(date) {
    var _a;
    // Create a new date object to avoid mutating the original
    const inputDate = new Date(date);
    // Set the date to the first day of the month
    inputDate === null || inputDate === void 0 ? void 0 : inputDate.setDate(1);
    // Get the day of the week for the first day of the month
    const firstDayOfMonth = inputDate === null || inputDate === void 0 ? void 0 : inputDate.getDay();
    // Calculate the day of the month for the given date
    const dayOfMonth = (_a = new Date(date)) === null || _a === void 0 ? void 0 : _a.getDate();
    // Calculate the week number
    const weekNumber = Math.ceil((dayOfMonth + firstDayOfMonth) / 7);
    return weekNumber >= 4 ? 4 : weekNumber;
}
function extractNameFromEmail(email) {
    // Find the index of the "@" symbol
    const atIndex = email.indexOf("@");
    // If "@" is not found, return an empty string
    if (atIndex === -1) {
        return "";
    }
    // Extract the part of the email before the "@" symbol
    return email.substring(0, atIndex);
}
