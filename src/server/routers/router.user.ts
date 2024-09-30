import express from "express"
import Middleware from "../middlewares/middleware.app"
import FetchOrCreateUser from "../controllers/user/controller.fetch-or-create"
import UpdateUser from "../controllers/user/controller.update-user"

const userRouter = express.Router()

userRouter.post("/fetch-or-create", Middleware, FetchOrCreateUser)

userRouter.patch("/update-user", Middleware, UpdateUser)

export default userRouter
