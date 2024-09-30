import { Request, Response } from "express"
import {
  ISale,
  SaleFilterOptions,
  SalesPeriod,
  SaleStatus,
} from "../../types/types.sale"
import { connectToDB } from "../../config/config.db"
import User from "../../models/model.user"
import Organization from "../../models/model.organization"
import { FilterQuery } from "mongoose"
import Sale from "../../models/model.sale"
import { parseApiResults } from "../../helpers/helper.index"

const GetOrganizationalSales = async (req: Request, res: Response) => {
  try {
    const payload: SaleFilterOptions = req.body

    payload.pageNumber = payload.pageNumber || 1
    payload.pageSize = payload.pageSize || 10
    payload.searchString = payload.searchString || ""
    payload.sortBy = payload.sortBy || "createdAt"
    payload.sortOrder = payload.sortOrder || "desc"

    connectToDB()

    // Find the user with the provided email
    const user = await User.findOne({ email: payload.email })

    if (!user)
      return res
        .status(412)
        .json({ message: "User not found", code: "412", data: {} })

    const isSearchingByPeriod = !!(
      payload.period ||
      (payload.startDate && payload.endDate)
    )

    // Find the organization with the provided unique id
    const organization = await Organization.findOne({
      _id: payload.organizationId,
    })

    if (!organization)
      return res
        .status(412)
        .json({ message: "Organization not found", code: "412", data: {} })

    let start, end
    const now = new Date()

    // Set date range based on the period
    switch (payload.period) {
      case SalesPeriod.THIS_WEEK:
        start = new Date(now.setDate(now.getDate() - now.getDay())).setHours(
          0,
          0,
          0,
          0
        )
        end = new Date(start)
        end.setDate(end.getDate() + 6)

        break
      case SalesPeriod.THIS_MONTH:
        start = new Date(now.getFullYear(), now.getMonth(), 1)
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        break
      case SalesPeriod.THIS_YEAR:
        start = new Date(now.getFullYear(), 0, 1)
        end = new Date(now.getFullYear(), 11, 31)
        break
      case SalesPeriod.TODAY:
        start = new Date(now.setHours(0, 0, 0, 0))
        end = new Date(now.setHours(23, 59, 59, 999))
        break
      case SalesPeriod.YESTERDAY:
        start = new Date(now.setDate(now.getDate() - 1))
        start.setHours(0, 0, 0, 0)
        end = new Date(start)
        end.setHours(23, 59, 59, 999)
        break
      case SalesPeriod.LAST_7_DAYS:
        start = new Date(now.setDate(now.getDate() - 7))
        end = new Date()
        break
      case SalesPeriod.LAST_30_DAYS:
        start = new Date(now.setDate(now.getDate() - 30))
        end = new Date()
        break
      default:
        if (payload.startDate && payload.endDate) {
          start = new Date(payload.startDate)
          end = new Date(payload.endDate)
        }
        break
    }

    // Calculate the number of orders to skip based on the page number and page size.
    const skipAmount = (payload.pageNumber - 1) * payload.pageSize

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(payload.searchString, "i")

    //calculate sales made for this week

    // Create an initial query object to filter orders.
    const query: FilterQuery<typeof Sale> = {
      organization: organization._id,
      status: payload.status || { $ne: SaleStatus.CANCELLED },
    }

    // If the period is provided, add the createdAt field to the query.

    if ((start && end) || payload.period) {
      query.createdAt = { $gte: start, $lte: end }
    }

    // If the search string is not empty, add the $or operator to match either name or genericName fields.
    if (payload.searchString.trim() !== "") {
      query.$or = [{ name: { $regex: regex } }]
    }

    // Define the sort options for the fetched orders based on createdAt field and provided sort order.
    const sortOptions = { [payload.sortBy]: payload.sortOrder }

    // Create a query to fetch the orders based on the search and sort criteria.
    const ordersQuery = Sale.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(isSearchingByPeriod ? 0 : payload.pageSize)
      .populate("saleItems")

    // Count the total number of orders that match the search criteria (without pagination).
    const totalOrdersCount = await Sale.countDocuments(query)

    const results: ISale[] = await ordersQuery.exec()

    // Check if there are more orders beyond the current page.
    const isNext = totalOrdersCount > skipAmount + results.length
    const totalPages = Math.ceil(totalOrdersCount / payload.pageSize)

    //get the total amount of sales
    const totalSalesAmount = results.reduce((sum, sale) => sum + sale.amount, 0)

    return res.status(200).json({
      message: "",
      code: "200",
      data: {
        ...parseApiResults({
          results,
          isNext,
          total: totalOrdersCount,
          pageSize: payload.pageSize,
          pageNumber: payload.pageNumber,
          totalPages,
          totalSalesAmount,
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
export default GetOrganizationalSales
