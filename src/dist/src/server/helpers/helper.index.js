"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseApiResults = parseApiResults;
function parseApiResults(results) {
    return JSON.parse(JSON.stringify(results));
}
