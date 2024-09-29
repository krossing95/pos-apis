import { NextFunction, Request, Response } from "express"
import { connectToDB } from "../config/config.db"

const Middleware = (req: Request, res: Response, next: NextFunction) => {
  const appKey = process.env.POS_APP_KEY
  const receivedApiKey = req.headers["api-key"]

  if (!appKey || !receivedApiKey)
    return res
      .status(401)
      .json({ message: "Unauthorized", code: "401", data: {} })

  if (appKey !== receivedApiKey)
    return res
      .status(401)
      .json({ message: "Unauthorized", code: "401", data: {} })

  connectToDB()

  next()
}
export default Middleware
