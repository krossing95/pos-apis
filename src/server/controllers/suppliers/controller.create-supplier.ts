import { Request, Response } from "express"
import { connectToDB } from "../../config/config.db"
import { createSupplierParams } from "../../types/types.supplier"
import User from "../../models/model.user"
import Supplier from "../../models/model.supplier"
import { parseApiResults } from "../../helpers/helper.index"

const CreateSupplier = async (req: Request, res: Response) => {
  try {
    const payload: createSupplierParams = req.body
    connectToDB()

    // Find the user with the provided unique id
    const user = await User.findOne({ _id: payload.createdById })
    if (!user)
      return res
        .status(412)
        .json({ message: "User not found", code: "412", data: {} })
    const newSupplier = new Supplier({
      name: payload.name,
      description: payload.description,
      image: payload.image,
      organization: payload.organizationId,
      createdBy: payload.createdById, // Use the mongoose ID of the user
      address: payload.address,
      phone: payload.phone,
      email: payload.email,
    })
    //check if the supplier name already exists
    const supplierExists = await Supplier.findOne({
      name: newSupplier.name,
    })
    if (supplierExists)
      return res.status(412).json({
        message: "Supplier with this name already exists",
        code: "412",
        data: {},
      })

    const createdSupplier = await newSupplier.save()
    return res.status(201).json({
      message: "Supplier created successfully",
      code: "201",
      data: { ...parseApiResults(createdSupplier) },
    })
  } catch (error) {
    return res.status(500).json({
      message: "Whoops! Something went wrong",
      code: "500",
      data: {},
    })
  }
}
export default CreateSupplier
