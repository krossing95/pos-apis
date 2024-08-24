import { Request, Response } from "express"
import { fetchAllProductsParams, ProductType } from "../../types/types.product"
import { FilterQuery } from "mongoose"
import Product from "../../models/model.product"
import { defaultGetActiveProductsQuery } from "../../utils/utils.index"
import { parseApiResults } from "../../helpers/helper.index"

const offsetCalculator = ({
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "createdAt",
  sortOrder = "desc",
}: fetchAllProductsParams) => {
  // Calculate the number of categories to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize

  // Create a case-insensitive regular expression for the provided search string.
  const regex = new RegExp(searchString, "i")

  // Create an initial query object to filter categories.
  const query: FilterQuery<typeof Product> = {
    ...defaultGetActiveProductsQuery,
  }

  // If the search string is not empty, add the $or operator to match either username or name fields.
  if (searchString.trim() !== "") {
    query.$or = [
      { name: { $regex: regex } },
      { description: { $regex: regex } },
    ]
  }

  // Define the sort options for the fetched products based on createdAt field and provided sort order.
  const sortOptions = { [sortBy]: sortOrder }

  return {
    skipAmount,
    regex,
    query,
    sortOptions,
    pageSize,
  }
}

const FetchAllProducts = async (req: Request, res: Response) => {
  const payload: fetchAllProductsParams = req.body
  try {
    // retrieve options
    const { skipAmount, query, sortOptions, pageSize } = offsetCalculator({
      ...payload,
    })

    // Create a query to fetch the products based on the search and sort criteria.

    const productsQuery = Product.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)

    // Count the total number of products that match the search criteria (without pagination).
    const totalProductsCount = await Product.countDocuments(query)

    const results: ProductType[] = await productsQuery.exec()

    // Check if there are more products beyond the current page.
    const isNext = totalProductsCount > skipAmount + results.length

    return res.status(200).json({
      message: "",
      code: "200",
      data: { ...parseApiResults({ results, isNext }) },
    })
  } catch (error) {
    return res.status(500).json({
      message: "Whoops! Something went wrong",
      code: "500",
      data: {},
    })
  }
}
export default FetchAllProducts
