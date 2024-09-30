import { Request, Response } from "express"
import { connectToDB } from "../../config/config.db"
import { FilterQuery, SortOrder } from "mongoose"
import User from "../../models/model.user"
import Supplier from "../../models/model.supplier"
import { defaultGetQuery } from "../../utils/utils.index"
import { SupplierType } from "../../types/types.supplier"

type GetSuppliersByUserPayload = {
  email: string
  searchString?: string
  pageNumber?: number
  pageSize?: number
  sortBy?: SortOrder
}

const GetSuppliersByUser = async (req: Request, res: Response) => {
  try {
    const payload: GetSuppliersByUserPayload = req.body
    connectToDB()
    payload.searchString = payload.searchString || ""
    payload.pageNumber = payload.pageNumber || 1
    payload.pageSize = payload.pageSize || 20
    payload.sortBy = payload.sortBy || "desc"

    // Calculate the number of suppliers to skip based on the page number and page size.
    const skipAmount = (payload.pageNumber - 1) * payload.pageSize

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(payload.searchString, "i")

    // Find the user by the provided email
    const user = await User.findOne({ email: payload.email })

    if (!user)
      return res
        .status(412)
        .json({ message: "User not found", code: "412", data: {} })

    // Create an initial query object to filter suppliers.
    const query: FilterQuery<typeof Supplier> = {
      createdBy: user._id,
      ...defaultGetQuery,
    }

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (payload.searchString.trim() !== "") {
      query.$or = [{ username: { $regex: regex } }, { name: { $regex: regex } }]
    }

    // Define the sort options for the fetched suppliers based on createdAt field and provided sort order.
    const sortOptions = { createdAt: payload.sortBy }

    // Create a query to fetch the suppliers based on the search and sort criteria.
    const organizationsQuery = Supplier.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(payload.pageSize)

    // Count the total number of suppliers that match the search criteria (without pagination).
    const totalSuppliersCount = await Supplier.countDocuments(query)

    const suppliers: SupplierType[] = await organizationsQuery.exec()

    // Check if there are more suppliers beyond the current page.
    const isNext = totalSuppliersCount > skipAmount + suppliers.length

    return res
      .status(200)
      .json({ message: "", code: "200", data: { suppliers, isNext } })
  } catch (error) {
    return res.status(500).json({
      message: "Whoops! Something went wrong",
      code: "500",
      data: {},
    })
  }
}
export default GetSuppliersByUser
