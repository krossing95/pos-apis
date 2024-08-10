import { Request, Response } from "express"
import { connectToDB } from "../../config/config.db"
import { updateCategoryParams } from "../../types/types.category"
import Category from "../../models/model.category"
import { parseApiResults } from "../../helpers/helper.index"

const UpdateCategory = async (req: Request, res: Response) => {
  try {
    connectToDB()
    const payload: updateCategoryParams = req.body
    // Find the category by its ID
    const category = await Category.findOne({ _id: payload.categoryId })

    if (!category)
      return res
        .status(412)
        .json({ message: "Category not found", code: "412", data: {} })

    // Update the category with the provided fields
    if (payload.name) {
      category.name = payload.name
    }
    if (payload.description) {
      category.description = payload.description
    }
    if (payload.phone) {
      category.phone = payload.phone
    }
    if (payload.image) {
      category.image = payload.image
    }
    if (payload.organizationId) {
      category.organization = payload.organizationId
    }
    // Save the updated category
    await category.save()

    return res.status(200).json({
      message: "",
      code: "200",
      data: { ...parseApiResults(category) },
    })
  } catch (error) {
    return res.status(500).json({
      message: "Whoops! Something went wrong",
      code: "500",
      data: {},
    })
  }
}
export default UpdateCategory
