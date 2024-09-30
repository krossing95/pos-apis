import { Request, Response } from "express"
import { ISale, ISaleItem, SaleStatus } from "../../types/types.sale"
import { connectToDB } from "../../config/config.db"
import Sale from "../../models/model.sale"
import SaleItem from "../../models/model.sale-item"
import Product from "../../models/model.product"
import { parseApiResults } from "../../helpers/helper.index"

type PayForSalePayload = {
  saleId: string
  saleData: Partial<ISale>
}

const PayForSale = async (req: Request, res: Response) => {
  try {
    const payload: PayForSalePayload = req.body
    connectToDB()
    const sale = await Sale.findById(payload.saleId)
    if (!sale)
      return res
        .status(412)
        .json({ message: "Sale not found", code: "412", data: {} })

    //reduce quantity of products in stock and increase quantity sold
    const saleItems: ISaleItem[] = sale.saleItems
    if (saleItems) {
      await Promise.all(
        saleItems.map(async (itemId) => {
          const saleItem: ISaleItem | null = await SaleItem.findById(itemId)
          if (saleItem) {
            const product = await Product.findById(saleItem.product)
            if (product) {
              product.onHandQuantity -= saleItem.quantity
              product.quantitySold += saleItem.quantity
              await product.save()
            }
          }
        })
      )
    }
    //update the sale with  a paid status and payment method
    sale.status = SaleStatus.PAID
    sale.paymentMethod = payload.saleData.paymentMethod
    sale.paidAt = new Date()
    sale.cashTendered = payload.saleData.cashTendered
    sale.note = payload.saleData.note
    sale.customerName = payload.saleData.customerName
    sale.customerPhone = payload.saleData.customerPhone

    await sale.save()

    return res.status(200).json({
      message: "Payment made successfully",
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
export default PayForSale
