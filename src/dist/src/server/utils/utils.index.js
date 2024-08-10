"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultGetActiveProductsQuery = exports.defaultGetQuery = void 0;
exports.defaultGetQuery = {
    isDeleted: { $ne: true },
};
exports.defaultGetActiveProductsQuery = Object.assign({ status: "active" }, exports.defaultGetQuery);
