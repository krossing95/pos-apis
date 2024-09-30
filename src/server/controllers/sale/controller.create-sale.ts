import { Request, Response } from "express"
import { ISale, ISaleItem } from "../../types/types.sale"
import mongoose from "mongoose"
import Sale from "../../models/model.sale"
import SaleItem from "../../models/model.sale-item"
import { parseApiResults } from "../../helpers/helper.index"

type CreateSalePayload = {
  saleData: Omit<ISale, "saleItems">
  saleItemsData: Omit<ISaleItem, "parentSaleId">[]
}

const CreateSale = async (req: Request, res: Response) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const payload: CreateSalePayload = req.body
    // Create the sale
    const sale = new Sale({
      ...payload.saleData,
      saleItems: [],
    })

    await sale.save({ session })

    // Create the sale items and associate them with the sale
    const saleItems = await Promise.all(
      payload.saleItemsData.map(async (itemData) => {
        const saleItem = new SaleItem({
          ...itemData,
          parentSaleId: sale._id,
        })
        await saleItem.save({ session })
        return saleItem._id
      })
    )

    // Update the sale with the created sale items
    sale.saleItems = saleItems
    await sale.save({ session })

    // Commit the transaction
    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
      message: "Sale created successfully",
      code: "201",
      data: { ...parseApiResults(sale) },
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    return res.status(500).json({
      message: "Whoops! Something went wrong",
      code: "500",
      data: {},
    })
  }
}
export default CreateSale
