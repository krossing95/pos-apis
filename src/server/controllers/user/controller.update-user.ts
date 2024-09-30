import { Request, Response } from "express"
import { connectToDB } from "../../config/config.db"
import { updateUserDetailsParams } from "../../types/type.user"
import User from "../../models/model.user"
import { parseApiResults } from "../../helpers/helper.index"

const UpdateUser = async (req: Request, res: Response) => {
  try {
    const payload: updateUserDetailsParams = req.body

    connectToDB()

    const updatedUser = await User.findByIdAndUpdate(payload._id, {
      ...payload,
    })

    return res
      .status(200)
      .status(200)
      .json({
        message: "User updated",
        code: "200",
        data: { ...parseApiResults(updatedUser) },
      })
  } catch (error) {
    return res.status(500).json({
      message: "Whoops! Something went wrong",
      code: "500",
      data: {},
    })
  }
}
export default UpdateUser
