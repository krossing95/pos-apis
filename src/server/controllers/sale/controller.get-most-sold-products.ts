import { Request, Response } from "express"
import { connectToDB } from "../../config/config.db"
import Organization from "../../models/model.organization"
import { ProductType } from "../../types/types.product"
import { parseApiResults } from "../../helpers/helper.index"

const Get10MostSoldProducts = async (req: Request, res: Response) => {
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

    // Sort products by quantity sold in descending order
    products.sort(
      (a: ProductType, b: ProductType) => b.quantitySold - a.quantitySold
    )

    // Get the top 10 most sold products
    const top10MostSoldProducts = products.slice(0, 10)

    return res.status(200).json({
      message: "",
      code: "200",
      data: { products: parseApiResults(top10MostSoldProducts) },
    })
  } catch (error) {
    return res.status(500).json({
      message: "Whoops! Something went wrong",
      code: "500",
      data: {},
    })
  }
}
export default Get10MostSoldProducts
