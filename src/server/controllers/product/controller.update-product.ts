import { Request, Response } from "express"
import { updateProductParams } from "../../types/types.product"
import { connectToDB } from "../../config/config.db"
import Product from "../../models/model.product"
import Category from "../../models/model.category"
import { parseApiResults } from "../../helpers/helper.index"

const ProductUpdate = async (req: Request, res: Response) => {
  try {
    const payload: updateProductParams = req.body
    connectToDB()
    // Find the product by its unique id
    const product = await Product.findOne({ _id: payload.productId })
    if (!product)
      return res
        .status(412)
        .json({ message: "Product not found", code: " 412", data: {} })
    if (payload.categoryId) {
      const category = await Category.findOne({ _id: payload.categoryId })

      if (!category)
        return res
          .status(412)
          .json({ message: "Category not found", code: "412", data: {} })
    }

    if (payload.name) {
      product.name = payload.name
    }
    if (payload.description) {
      product.description = payload.description
    }
    if (payload.image) {
      product.image = payload.image
    }
    if (payload.organizationId) {
      product.organization = payload.organizationId
    }
    if (payload.genericName) {
      product.genericName = payload.genericName
    }
    if (payload.productCode) {
      product.productCode = payload.productCode
    }
    if (payload.costPrice) {
      product.costPrice = payload.costPrice
    }
    if (payload.sellingPrice) {
      product.sellingPrice = payload.sellingPrice
    }
    if (payload.quantity) {
      product.quantity = payload.quantity
      product.onHandQuantity = payload.quantity
    }

    if (payload.categoryId) {
      product.categoryId = payload.categoryId
    }
    if (payload.supplierId) {
      product.supplierId = payload.supplierId
    }
    if (payload.dateOfArrival) {
      product.dateOfArrival = payload.dateOfArrival
    }
    if (payload.status) {
      product.status = payload.status
    }

    // Save the updated product
    await product.save()

    return res.status(200).json({
      message: "Product updated successfully",
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
export default ProductUpdate
