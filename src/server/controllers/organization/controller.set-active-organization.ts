import { Request, Response } from "express"
import { connectToDB } from "../../config/config.db"
import User from "../../models/model.user"
import Organization from "../../models/model.organization"
import { defaultGetQuery } from "../../utils/utils.index"
import { parseApiResults } from "../../helpers/helper.index"

const SetActiveOrganization = async (req: Request, res: Response) => {
  try {
    connectToDB()
    const payload: { userId: string; organizationId: string } = req.body
    const [user, organization] = await Promise.all([
      User.findOne({ _id: payload.userId }),
      Organization.findOne({
        _id: payload.organizationId,
        ...defaultGetQuery,
      }),
    ])
    if (!user || !organization)
      return res.status(412).json({
        message: "User or organization not found",
        code: "412",
        data: {},
      })

    //check if the organization is already the active organization
    if (
      user.activeOrganization &&
      user.activeOrganization?.toString() === organization._id.toString()
    )
      return res.status(412).json({
        message: "Organization is already the active organization",
        code: "412",
        data: {},
      })

    // Update the user's active organization
    user.activeOrganization = organization._id
    await user.save()

    return res.status(200).json({
      message: "",
      code: "200",
      data: { ...parseApiResults(organization) },
    })
  } catch (error) {
    return res.status(500).json({
      message: "Whoops! Something went wrong",
      code: "500",
      data: {},
    })
  }
}
export default SetActiveOrganization
