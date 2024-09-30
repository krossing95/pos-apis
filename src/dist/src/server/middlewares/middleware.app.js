"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_db_1 = require("../config/config.db");
const Middleware = (req, res, next) => {
    const appKey = process.env.POS_APP_KEY;
    const receivedApiKey = req.headers["api-key"];
    if (!appKey || !receivedApiKey)
        return res
            .status(401)
            .json({ message: "Unauthorized", code: "401", data: {} });
    if (appKey !== receivedApiKey)
        return res
            .status(401)
            .json({ message: "Unauthorized", code: "401", data: {} });
    (0, config_db_1.connectToDB)();
    next();
};
exports.default = Middleware;
