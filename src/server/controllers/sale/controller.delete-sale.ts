import { Request, Response } from "express"
import Sale from "../../models/model.sale"
import { connectToDB } from "../../config/config.db"

const DeleteSale = async (req: Request, res: Response) => {
  try {
    const payload: { saleId: string } = req.body
    connectToDB()
    // find the sale by id and check if it exists
    const saleExists = await Sale.findById(payload.saleId)
    if (!saleExists)
      return res
        .status(412)
        .json({ message: "Sale not found", code: "412", data: {} })

    await Sale.findByIdAndDelete(payload.saleId)
    return res
      .status(200)
      .json({ message: "Sale deleted successfully", code: "200", data: {} })
  } catch (error) {
    return res.status(500).json({
      message: "Whoops! Something went wrong",
      code: "500",
      data: {},
    })
  }
}
export default DeleteSale
