import { Request, Response } from "express"
import mongoose from "mongoose"
import Sale from "../../models/model.sale"
import { parseApiResults } from "../../helpers/helper.index"

const GetSaleById = async (req: Request, res: Response) => {
  try {
    const payload: { saleId: string } = req.body

    if (!mongoose.Types.ObjectId.isValid(payload.saleId))
      return res
        .status(412)
        .json({ message: "Invalid sale id", code: "412", data: {} })

    const sale = await Sale.findById(payload.saleId).populate("saleItems")

    return res.status(200).json({
      message: "Sale deleted",
      code: "200",
      data: { ...parseApiResults(sale) },
    })
  } catch (error) {
    return res.status(500).json({
      message: "Whoops! Something went wrong",
      code: "500",
      data: {},
    })
  }
}
export default GetSaleById
