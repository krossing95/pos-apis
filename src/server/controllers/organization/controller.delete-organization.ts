import { Request, Response } from "express"
import Organization from "../../models/model.organization"
import { parseApiResults } from "../../helpers/helper.index"

const DeleteOrganization = async (req: Request, res: Response) => {
  try {
    const payload: { organizationId: string } = req.body
    // Find the organization by its ID and delete it
    const deletedOrganization = await Organization.findByIdAndUpdate(
      payload.organizationId,
      { isDeleted: true }
    )

    if (!deletedOrganization)
      return res
        .status(412)
        .json({ message: "Organization not found", code: "412", data: {} })

    // // Find all users who are part of the organization
    // const organizationUsers = await User.find({
    //   organizations: organizationId,
    // });

    // // Remove the organization from the 'organizations' array for each user
    // const updateUserPromises = organizationUsers.map((user) => {
    //   user.organizations.pull(organizationId);
    //   return user.save();
    // });

    // await Promise.all(updateUserPromises);

    return res.status(200).json({
      message: "",
      code: "200",
      data: { ...parseApiResults(deletedOrganization) },
    })
  } catch (error) {
    return res.status(500).json({
      message: "Whoops! Something went wrong",
      code: "500",
      data: {},
    })
  }
}
export default DeleteOrganization
