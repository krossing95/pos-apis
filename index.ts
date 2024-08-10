import express from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import cors from "cors"
import { createServer } from "http"
import categoryRouter from "./src/server/routers/router.category"
import organizationRouter from "./src/server/routers/router.organization"

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

const server = createServer(app)
server.listen(PORT, () => console.log(`Service is running on port ${PORT}`))
