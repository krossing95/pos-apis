import express from "express"
import CreateCategory from "../controllers/category/controller.create-category"
import DeleteCategory from "../controllers/category/controller.delete-category"
import GetAllCategories from "../controllers/category/controller.get-all-categories"
import GetCategoriesByUser from "../controllers/category/controller.get-categories-by-user"
import GetOrganizationalCategories from "../controllers/category/controller.get-organizational-categories"
import UpdateCategory from "../controllers/category/controller.update-category"
import Middleware from "../middlewares/middleware.app"

const categoryRouter = express.Router()

categoryRouter.post("/", Middleware, CreateCategory)
categoryRouter.delete("/", Middleware, DeleteCategory)
categoryRouter.get("/get-all", Middleware, GetAllCategories)
categoryRouter.get("/get-by-user", Middleware, GetCategoriesByUser)
categoryRouter.get(
  "/get-by-organization",
  Middleware,
  GetOrganizationalCategories
)
categoryRouter.patch("/", Middleware, UpdateCategory)

export default categoryRouter
