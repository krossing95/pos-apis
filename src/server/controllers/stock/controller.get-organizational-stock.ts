import { Request, Response } from "express"
import { connectToDB } from "../../config/config.db"
import { StockFilterOptions, StockType } from "../../types/types.stock"
import Organization from "../../models/model.organization"
import { FilterQuery } from "mongoose"
import Stock from "../../models/model.stock"
import { parseApiResults } from "../../helpers/helper.index"

const GetOrganizationalStock = async (req: Request, res: Response) => {
  try {
    const payload: StockFilterOptions = req.body

    payload.pageNumber = payload.pageNumber || 1
    payload.pageSize = payload.pageSize || 10
    payload.searchString = payload.searchString || ""
    payload.searchString = payload.searchString || "desc"

    connectToDB()

    const organization = await Organization.findOne({
      _id: payload.organizationId,
    })

    if (!organization)
      return res
        .status(412)
        .json({ message: "Organization not found", code: "412", data: {} })

    // Calculate the number of orders to skip based on the page number and page size.
    const skipAmount = (payload.pageNumber - 1) * payload.pageSize

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(payload.searchString, "i")

    // Create an initial query object to filter orders.
    const query: FilterQuery<typeof Stock> = {
      organization: organization._id,
    }

    // If the search string is not empty, add the $or operator to match either name or genericName fields.
    if (payload.searchString.trim() !== "") {
      query.$or = [{ name: { $regex: regex } }]
    }

    // Define the sort options for the fetched orders based on createdAt field and provided sort order.

    const sortOptions = payload.sortBy

    // Create a query to fetch the orders based on the search and sort criteria.
    const stocksQuery = Stock.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(payload.pageSize)

    // Count the total number of orders that match the search criteria (without pagination).
    const totalStocksCount = await Stock.countDocuments(query)

    const results: StockType[] = await stocksQuery.exec()

    // Check if there are more orders beyond the current page.
    const isNext = totalStocksCount > skipAmount + results.length
    const totalPages = Math.ceil(totalStocksCount / payload.pageSize)

    return res.status(200).json({
      message: "",
      code: "200",
      data: {
        ...parseApiResults({
          results,
          isNext,
          total: totalStocksCount,
          pageSize: payload.pageSize,
          pageNumber: payload.pageNumber,
          totalPages,
        }),
      },
    })
  } catch (error) {
    return res.status(500).json({
      message: "Whoops! Something went wrong",
      code: "500",
      data: {},
    })
  }
}
export default GetOrganizationalStock
