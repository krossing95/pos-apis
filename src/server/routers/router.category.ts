import express from "express"
import CreateCategory from "../controllers/category/controller.create-category"
import DeleteCategory from "../controllers/category/controller.delete-category"
import GetAllCategories from "../controllers/category/controller.get-all-categories"
import GetCategoriesByUser from "../controllers/category/controller.get-categories-by-user"
import GetOrganizationalCategories from "../controllers/category/controller.get-organizational-categories"
import UpdateCategory from "../controllers/category/controller.update-category"

const categoryRouter = express.Router()

categoryRouter.post("/", CreateCategory)
categoryRouter.delete("/", DeleteCategory)
categoryRouter.get("/get-all", GetAllCategories)
categoryRouter.get("/get-by-user", GetCategoriesByUser)
categoryRouter.get("/get-by-organization", GetOrganizationalCategories)
categoryRouter.patch("/", UpdateCategory)

export default categoryRouter
