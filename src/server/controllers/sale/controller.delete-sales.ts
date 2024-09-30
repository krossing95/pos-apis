import { Request, Response } from "express"
import Sale from "../../models/model.sale"
import SaleItem from "../../models/model.sale-item"
import { connectToDB } from "../../config/config.db"

const DeleteAllSalesAndSaleItems = async (req: Request, res: Response) => {
  try {
    connectToDB()
    await Sale.deleteMany({})
    await SaleItem.deleteMany({})
    return res.status(200).json({
      message: "All sales and sale items deleted",
      code: "200",
      data: {},
    })
  } catch (error) {
    throw error
  }
}
export default DeleteAllSalesAndSaleItems
