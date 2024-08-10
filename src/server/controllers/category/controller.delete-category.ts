import { Request, Response } from "express"
import Category from "../../models/model.category"
import { parseApiResults } from "../../helpers/helper.index"

const DeleteCategory = async (req: Request, res: Response) => {
  try {
    const paylaod: { categoryId: string } = req.body

    // Find the category by its unique id
    const category = await Category.findOne({ _id: paylaod.categoryId })

    if (!category)
      return res
        .status(412)
        .json({ message: "Category not found", code: "412", data: {} })

    //update isDeleted field to true
    category.isDeleted = true

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
export default DeleteCategory
