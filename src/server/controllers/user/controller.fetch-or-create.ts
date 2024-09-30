import { Request, Response } from "express"
import { getOrCreateUserParams } from "../../types/type.user"
import { connectToDB } from "../../config/config.db"
import User from "../../models/model.user"
import { extractNameFromEmail } from "../../helpers/helper.index"

const FetchOrCreateUser = async (req: Request, res: Response) => {
  try {
    const payload: getOrCreateUserParams = req.body
    connectToDB()
    //find user by id and populate communities
    let user
    const findUser = await User.findOne({ email: payload.email })
    if (findUser) {
      user = findUser
    }
    //if user is not found, create a new user
    if (!findUser) {
      const createUser = await User.create({
        email: payload.email,
        onboarded: false,
        name: payload.name,
        username: extractNameFromEmail(payload.email),
        verified: false,
        organizations: [],
      })
      user = createUser
    }
    return res.status(200).json({ message: "", code: "200", data: { user } })
  } catch (error) {
    return res.status(500).json({
      message: "Whoops! Something went wrong",
      code: "500",
      data: {},
    })
  }
}
export default FetchOrCreateUser
