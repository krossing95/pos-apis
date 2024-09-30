import { Request, Response } from "express"
import { StockType } from "../../types/types.stock"
import { connectToDB } from "../../config/config.db"
import User from "../../models/model.user"
import Product from "../../models/model.product"
import Stock from "../../models/model.stock"
import { parseApiResults } from "../../helpers/helper.index"

const AddStock = async (req: Request, res: Response) => {
  try {
    const payload: StockType = req.body
    connectToDB()
    // Find the user with the provided unique id
    const user = await User.findOne({ _id: payload.createdBy })
    if (!user)
      return res
        .status(412)
        .json({ message: "User not found", code: "412", data: {} })

    // Find the product with the provided unique id
    const product = await Product.findOne({
      _id: payload.itemId,
    })
    if (!product)
      return res
        .status(412)
        .json({ message: "Product not found", code: "412", data: {} })

    const newStock = new Stock({
      organization: payload.organization,
      createdBy: payload.createdBy, // Use the mongoose ID of the user
      itemName: payload.itemName,
      itemId: payload.itemId,
      categoryId: payload.categoryId,
      oldQuantity: payload.oldQuantity,
      quantityAdded: payload.quantityAdded,
      newQuantity: payload.newQuantity,
      createdAt: payload.createdAt,
    })

    const createdStock = await newStock.save()

    // get the product and update the quantity
    product.quantity = payload.newQuantity
    await product.save()

    return res.status(201).json({
      message: "Stock created successfully",
      code: "201",
      data: { ...parseApiResults(createdStock) },
    })
  } catch (error) {
    return res.status(500).json({
      message: "Whoops! Something went wrong",
      code: "500",
      data: {},
    })
  }
}
export default AddStock
