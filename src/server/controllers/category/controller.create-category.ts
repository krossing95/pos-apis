import User from "../../models/model.user"
import Category from "../../models/model.category"
import { parseApiResults } from "../../helpers/helper.index"
import { CategoryType, createCategoryParams } from "../../types/types.category"
import { Request, Response } from "express"

const CreateCategory = async (req: Request, res: Response) => {
  try {
    const payload: createCategoryParams = req.body
    // Find the user with the provided unique id
    const user = await User.findOne({ _id: payload.createdById })
    if (!user)
      return res
        .status(412)
        .json({ message: "User not found", code: "412", data: {} })
    const newOrganization = new Category({
      name: payload.name,
      description: payload.description,
      image: payload.image,
      organization: payload.organizationId,
      createdBy: payload.createdById, // Use the mongoose ID of the user
    })

    //check if the organization name already exists
    const categoryExists = await Category.findOne({
      name: newOrganization.name,
    })

    if (!categoryExists)
      return res.status(412).json({
        message: "Category with this name already exists",
        code: "412",
        data: {},
      })
    const createdCategory = await newOrganization.save()

    return res.status(201).json({
      message: "Category created",
      code: "201",
      data: { category: parseApiResults(createdCategory) as CategoryType },
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Whoops! Something went wrong", code: "500", data: {} })
  }
}
export default CreateCategory
