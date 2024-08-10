import { Request, Response } from "express"
import { connectToDB } from "../../config/config.db"
import { createOrganizationParams } from "../../types/types.organization"
import User from "../../models/model.user"
import Organization from "../../models/model.organization"
import { parseApiResults } from "../../helpers/helper.index"

const CreateOrganization = async (req: Request, res: Response) => {
  try {
    connectToDB()
    const payload: createOrganizationParams = req.body
    // Find the user with the provided unique id
    const user = await User.findOne({ _id: payload.createdById })

    if (!user)
      return res
        .status(412)
        .json({ message: "User not found", code: "412", data: {} })
    const newOrganization = new Organization({
      name: payload.name,
      description: payload.description,
      logo: payload.logo,
      address: payload.address,
      phone: payload.phone,
      createdBy: payload.createdById, // Use the mongoose ID of the user
    })
    //check if the organization name already exists
    const organizationExists = await Organization.findOne({
      name: newOrganization.name,
    })

    if (organizationExists)
      return res.status(412).json({
        message: "Organization with this name already exists",
        code: "412",
        data: {},
      })

    const createdOrganization = await newOrganization.save()

    // Update User model
    user.organizations.push(createdOrganization._id)
    await user.save()

    return res.status(200).json({
      message: "",
      code: "200",
      data: { ...parseApiResults(createdOrganization) },
    })
  } catch (error) {
    return res.status(500).json({
      message: "Whoops! Something went wrong",
      code: "500",
      data: {},
    })
  }
}
export default CreateOrganization
