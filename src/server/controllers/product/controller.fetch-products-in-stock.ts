import { Request, Response } from "express"
import {
  fetchProductsByOrganizationParams,
  ProductType,
} from "../../types/types.product"
import { connectToDB } from "../../config/config.db"
import User from "../../models/model.user"
import Organization from "../../models/model.organization"
import { defaultGetActiveProductsQuery } from "../../utils/utils.index"
import Product from "../../models/model.product"
import { FilterQuery } from "mongoose"
import { parseApiResults } from "../../helpers/helper.index"

const offsetCalculator = ({
  organizationId,
  searchString = "",
  pageNumber = 1,
  pageSize = 10,
  sortBy = "createdAt",
  sortOrder = "desc",
}: fetchProductsByOrganizationParams) => {
  const skipAmount = (pageNumber - 1) * pageSize
  const regex = new RegExp(searchString, "i")
  const query: FilterQuery<typeof Product> = {
    organization: organizationId,
    quantity: { $gt: 0 },
    ...defaultGetActiveProductsQuery,
  }

  // If the search string is not empty, add the $or operator to match either name or genericName fields.
  if (searchString.trim() !== "") {
    query.$or = [
      { name: { $regex: regex } },
      { genericName: { $regex: regex } },
    ]
  }

  const sortOptions = { [sortBy]: sortOrder }

  return {
    skipAmount,
    query,
    sortOptions,
    pageSize,
  }
}

const FetchProductsInStock = async (req: Request, res: Response) => {
  try {
    const payload: fetchProductsByOrganizationParams = req.body
    connectToDB()

    // Find the user with the provided email
    const user = await User.findOne({ email: payload.email })

    if (!user)
      return res
        .status(412)
        .json({ message: "User not found", code: "412", data: {} })

    // Find the organization with the provided unique id
    const organization = await Organization.findOne({
      _id: payload.organizationId,
    })

    if (!organization)
      return res
        .status(412)
        .json({ message: "Organization not found", code: "412", data: {} })

    const { pageSize, query, skipAmount, sortOptions } = offsetCalculator({
      ...payload,
    })

    const productsQuery = Product.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)

    // Count the total number of products that match the search criteria (without pagination).
    const totalProductsCount = await Product.countDocuments(query)

    const results: ProductType[] = await productsQuery.exec()

    // Check if there are more products beyond the current page.
    const isNext = totalProductsCount > skipAmount + results.length
    const totalPages = Math.ceil(totalProductsCount / pageSize)

    return res.status(200).json({
      message: "",
      code: "200",
      data: {
        ...parseApiResults({
          results,
          isNext,
          total: totalProductsCount,
          pageSize,
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
export default FetchProductsInStock
