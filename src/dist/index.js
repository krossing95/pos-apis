"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const router_category_1 = __importDefault(require("./src/server/routers/router.category"));
const router_organization_1 = __importDefault(require("./src/server/routers/router.organization"));
const router_product_1 = __importDefault(require("./src/server/routers/router.product"));
const router_sale_1 = __importDefault(require("./src/server/routers/router.sale"));
const router_stock_1 = __importDefault(require("./src/server/routers/router.stock"));
const router_supplier_1 = __importDefault(require("./src/server/routers/router.supplier"));
const router_user_1 = __importDefault(require("./src/server/routers/router.user"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const PORT = process.env.PORT || process.env.POS_PORT;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: ["http://localhost:3007"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
}));
app.use(express_1.default.json({ limit: "1mb" }));
app.get("/", (req, res) => {
    return res.send("pos app");
});
// Routers
app.use("/api/categories", router_category_1.default);
app.use("/api/organizations", router_organization_1.default);
app.use("/api/products", router_product_1.default);
app.use("/api/sales", router_sale_1.default);
app.use("/api/stocks", router_stock_1.default);
app.use("/api/suppliers", router_supplier_1.default);
app.use("/api/users", router_user_1.default);
const server = (0, http_1.createServer)(app);
server.listen(PORT, () => console.log(`Service is running on port ${PORT}`));
