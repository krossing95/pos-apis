import { Request, Response } from "express"
import { connectToDB } from "../../config/config.db"
import { createProductParams } from "../../types/types.product"
import User from "../../models/model.user"
import Category from "../../models/model.category"
import Product from "../../models/model.product"
import Organization from "../../models/model.organization"
import { parseApiResults } from "../../helpers/helper.index"

const CreateProduct = async (req: Request, res: Response) => {
  try {
    connectToDB()
    const payload: createProductParams = req.body
    // Find the user and category concurrently with the provided unique id

    const [user, category] = await Promise.all([
      User.findOne({ _id: payload.createdById }),
      Category.findOne({ _id: payload.categoryId }),
    ])

    if (!user || !category)
      return res
        .status(412)
        .json({ message: "User or category not found", code: "412", data: {} })

    // Create a new product instance
    const product = new Product({
      name: payload.name,
      description: payload.description,
      image: payload.image,
      organization: payload.organizationId,
      genericName: payload.genericName,
      productCode: payload.productCode,
      createdBy: user._id,
      costPrice: payload.costPrice,
      sellingPrice: payload.sellingPrice,
      quantity: payload.quantity,
      onHandQuantity: payload.quantity,
      category: payload.categoryId,
      supplierId: payload.supplierId,
      dateOfArrival: payload.dateOfArrival,
    })

    // Save the new product instance
    await product.save()

    //add product to the organization products
    const organization = await Organization.findOne({
      _id: payload.organizationId,
    }).populate("products")
    if (!organization)
      return res
        .status(412)
        .json({ message: "Organization not found", code: "412", data: {} })

    organization.products.push(product)
    await organization.save()

    return res
      .status(200)
      .json({ message: "", code: "200", data: { ...parseApiResults(product) } })
  } catch (error) {
    return res.status(500).json({
      message: "Whoops! Something went wrong",
      code: "500",
      data: {},
    })
  }
}
export default CreateProduct
