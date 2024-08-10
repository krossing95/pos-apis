import { Request, Response } from "express"
import { connectToDB } from "../../config/config.db"
import {
  CategoryType,
  fetchAllCategoriesParams,
} from "../../types/types.category"
import { defaultGetQuery } from "../../utils/utils.index"
import { FilterQuery } from "mongoose"
import Category from "../../models/model.category"

const offsetCalculator = ({
  pageNumber = 1,
  pageSize = 20,
  searchString = "",
  sortBy = "desc",
}: fetchAllCategoriesParams) => {
  // Calculate the number of categories to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize

  // Create a case-insensitive regular expression for the provided search string.
  const regex = new RegExp(searchString, "i")

  // Create an initial query object to filter categories.
  const query: FilterQuery<typeof Category> = {
    ...defaultGetQuery,
  }

  // If the search string is not empty, add the $or operator to match either username or name fields.
  if (searchString.trim() !== "") {
    query.$or = [{ username: { $regex: regex } }, { name: { $regex: regex } }]
  }

  // Define the sort options for the fetched categories based on createdAt field and provided sort order.
  const sortOptions = { createdAt: sortBy }

  return {
    skipAmount,
    regex,
    query,
    sortOptions,
    pageSize,
  }
}

const GetAllCategories = async (req: Request, res: Response) => {
  try {
    const payload: fetchAllCategoriesParams = req.body
    connectToDB()

    const { skipAmount, query, sortOptions, pageSize } = offsetCalculator({
      ...payload,
    })

    // Create a query to fetch the categories based on the search and sort criteria.
    const categoriesQuery = Category.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)

    // Count the total number of categories that match the search criteria (without pagination).
    const totalCategoriesCount = await Category.countDocuments(query)

    const categories: CategoryType[] = await categoriesQuery.exec()

    // Check if there are more categories beyond the current page.
    const isNext = totalCategoriesCount > skipAmount + categories.length

    return res
      .status(200)
      .json({ message: "", code: "200", data: { categories, isNext } })
  } catch (error) {
    return res.status(500).json({
      message: "Whoops! Something went wrong",
      code: "500",
      data: {},
    })
  }
}
export default GetAllCategories
