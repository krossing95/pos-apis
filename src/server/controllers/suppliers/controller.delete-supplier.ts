import { Request, Response } from "express"
import { connectToDB } from "../../config/config.db"
import Supplier from "../../models/model.supplier"
import { parseApiResults } from "../../helpers/helper.index"

const DeleteSupplier = async (req: Request, res: Response) => {
  try {
    const payload: { supplierId: string } = req.body
    connectToDB()
    // Find the supplier by its unique id
    const supplier = await Supplier.findOne({ _id: payload.supplierId })

    if (!supplier)
      return res
        .status(412)
        .json({ message: "Supplier not found", code: "412", data: {} })

    //update isDeleted field to true
    supplier.isDeleted = true

    // Save the updated supplier

    await supplier.save()

    return res.status(200).json({
      message: "Supplier removed successfully",
      code: "200",
      data: { ...parseApiResults(supplier) },
    })
  } catch (error) {
    return res.status(500).json({
      message: "Whoops! Something went wrong",
      code: "500",
      data: {},
    })
  }
}
export default DeleteSupplier
