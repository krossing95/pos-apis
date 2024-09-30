import { Request, Response } from "express"
import { connectToDB } from "../../config/config.db"
import { updateSupplierParams } from "../../types/types.supplier"
import Supplier from "../../models/model.supplier"
import { parseApiResults } from "../../helpers/helper.index"

const UpdateSupplier = async (req: Request, res: Response) => {
  try {
    const payload: updateSupplierParams = req.body
    connectToDB()
    // Find the supplier by its ID
    const supplier = await Supplier.findOne({ _id: payload.supplierId })
    if (!supplier)
      return res
        .status(412)
        .json({ message: "Supplier not found", code: "412", data: {} })

    // Update the supplier with the provided fields
    if (payload.name) {
      supplier.name = payload.name
    }
    if (payload.description) {
      supplier.description = payload.description
    }
    if (payload.phone) {
      supplier.phone = payload.phone
    }
    if (payload.image) {
      supplier.image = payload.image
    }
    if (payload.organizationId) {
      supplier.organization = payload.organizationId
    }
    if (payload.email) {
      supplier.email = payload.email
    }
    if (payload.address) {
      supplier.address = payload.address
    }

    // Save the updated supplier
    await supplier.save()

    return res.status(200).json({
      message: "Supplier updated successfully",
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
export default UpdateSupplier
