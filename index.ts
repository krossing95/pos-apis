import express from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import cors from "cors"
import { createServer } from "http"
import categoryRouter from "./src/server/routers/router.category"
import organizationRouter from "./src/server/routers/router.organization"
import productsRouter from "./src/server/routers/router.product"
import salesRouter from "./src/server/routers/router.sale"
import stockRouter from "./src/server/routers/router.stock"
import supplierRouter from "./src/server/routers/router.supplier"
import userRouter from "./src/server/routers/router.user"

const app = express()
dotenv.config()
const PORT = process.env.PORT || process.env.POS_PORT
app.use(helmet())
app.use(
  cors({
    origin: ["http://localhost:3007"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
)
app.use(express.json({ limit: "1mb" }))

app.get("/", (req, res) => {
  return res.send("pos app")
})

// Routers

app.use("/api/categories", categoryRouter)
app.use("/api/organizations", organizationRouter)
app.use("/api/products", productsRouter)
app.use("/api/sales", salesRouter)
app.use("/api/stocks", stockRouter)
app.use("/api/suppliers", supplierRouter)
app.use("/api/users", userRouter)

const server = createServer(app)
server.listen(PORT, () => console.log(`Service is running on port ${PORT}`))
