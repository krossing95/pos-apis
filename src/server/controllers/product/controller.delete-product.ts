import { Request, Response } from "express"
import { connectToDB } from "../../config/config.db"
import Product from "../../models/model.product"
import { parseApiResults } from "../../helpers/helper.index"

const DeleteProduct = async (req: Request, res: Response) => {
  try {
    connectToDB()
    const payload: { productId: string } = req.body
    // Find the product by its unique id
    const product = await Product.findOne({ _id: payload.productId })
    if (!product)
      return res
        .status(412)
        .json({ message: "Product not found", code: " 412", data: {} })

    // soft-delete the product

    product.isDeleted = true
    await product.save()

    return res.status(200).json({
      message: "Product removed",
      code: "200",
      data: { ...parseApiResults(product) },
    })
  } catch (error) {
    return res.status(500).json({
      message: "Whoops! Something went wrong",
      code: "500",
      data: {},
    })
  }
}
export default DeleteProduct
