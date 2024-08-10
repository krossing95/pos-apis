import { Request, Response } from "express"
import { createOrganizationParams } from "../../types/types.organization"
import Organization from "../../models/model.organization"
import { parseApiResults } from "../../helpers/helper.index"

const UpdateOrganization = async (req: Request, res: Response) => {
  try {
    const payload: createOrganizationParams = req.body
    // Find the organization by its _id and update the information
    const updatedOrganization = await Organization.findOneAndUpdate(
      { _id: payload.organizationId },
      {
        name: payload.name,
        description: payload.description,
        phone: payload.phone,
        logo: payload.logo,
        address: payload.address,
      }
    )

    if (!updatedOrganization)
      return res
        .status(412)
        .json({ message: "Organization not found", code: "412", data: {} })

    return res.status(200).json({
      message: "",
      code: "200",
      data: { ...parseApiResults(updatedOrganization) },
    })
  } catch (error) {
    return res.status(500).json({
      message: "Whoops! Something went wrong",
      code: "500",
      data: {},
    })
  }
}
export default UpdateOrganization
