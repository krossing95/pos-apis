import express from "express"
import CreateOrganization from "../controllers/organization/controller.create-organization"
import DeleteOrganization from "../controllers/organization/controller.delete-organization"
import GetAllOrganizations from "../controllers/organization/controller.get-all-organizations"
import GetUserOrganizations from "../controllers/organization/controller.get-user-organizations"
import UpdateOrganization from "../controllers/organization/controller.update-organization"
import SetActiveOrganization from "../controllers/organization/controller.set-active-organization"
import Middleware from "../middlewares/middleware.app"

const organizationRouter = express.Router()

organizationRouter.post("/", Middleware, CreateOrganization)
organizationRouter.delete("/", Middleware, DeleteOrganization)
organizationRouter.get("/get-all", Middleware, GetAllOrganizations)
organizationRouter.get("/by-user", Middleware, GetUserOrganizations)
organizationRouter.patch("/", Middleware, UpdateOrganization)
organizationRouter.patch("/activate", Middleware, SetActiveOrganization)

export default organizationRouter
