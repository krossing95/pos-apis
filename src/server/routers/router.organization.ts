import express from "express"
import CreateOrganization from "../controllers/organization/controller.create-organization"
import DeleteOrganization from "../controllers/organization/controller.delete-organization"
import GetAllOrganizations from "../controllers/organization/controller.get-all-organizations"
import GetUserOrganizations from "../controllers/organization/controller.get-user-organizations"
import UpdateOrganization from "../controllers/organization/controller.update-organization"
import SetActiveOrganization from "../controllers/organization/controller.set-active-organization"

const organizationRouter = express.Router()

organizationRouter.post("/", CreateOrganization)
organizationRouter.delete("/", DeleteOrganization)
organizationRouter.get("/get-all", GetAllOrganizations)
organizationRouter.get("/by-user", GetUserOrganizations)
organizationRouter.patch("/", UpdateOrganization)
organizationRouter.patch("/activate", SetActiveOrganization)

export default organizationRouter
