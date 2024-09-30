import { Request, Response } from "express"
import { connectToDB } from "../../config/config.db"
import Organization from "../../models/model.organization"
import { ProductType } from "../../types/types.product"
import { parseApiResults } from "../../helpers/helper.index"

const GetLeastSoldProducts = async (req: Request, res: Response) => {
  try {
    const payload: { organizationId: string } = req.body
    connectToDB()
    const organization = await Organization.findById(
      payload.organizationId
    ).populate("products")

    if (!organization)
      return res
        .status(412)
        .json({ message: "Organization not found", code: "412", data: {} })

    // Get all products sold by the organization
    const products = organization.products

    // Sort products by quantity sold in ascending order
    products.sort(
      (a: ProductType, b: ProductType) => a.quantitySold - b.quantitySold
    )

    // Get the top 10 least sold products
    const top10LeastSoldProducts = products.slice(0, 10)

    return res.status(200).json({
      message: "",
      code: "200",
      data: { products: parseApiResults(top10LeastSoldProducts) },
    })
  } catch (error) {
    return res.status(500).json({
      message: "Whoops! Something went wrong",
      code: "500",
      data: {},
    })
  }
}
export default GetLeastSoldProducts
