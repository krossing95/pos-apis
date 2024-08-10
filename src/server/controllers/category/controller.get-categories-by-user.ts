import { Request, Response } from "express"
import {
  CategoryType,
  fetchCategoriesByUserParams,
} from "../../types/types.category"
import { connectToDB } from "../../config/config.db"
import User from "../../models/model.user"
import { FilterQuery } from "mongoose"
import Category from "../../models/model.category"
import { defaultGetQuery } from "../../utils/utils.index"
import { parseApiResults } from "../../helpers/helper.index"

const offsetCalculator = ({
  pageNumber = 1,
  pageSize = 20,
  searchString = "",
  sortBy = "desc",
  userId,
}: fetchCategoriesByUserParams & { userId: string }) => {
  // Calculate the number of categories to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize

  // Create a case-insensitive regular expression for the provided search string.
  const regex = new RegExp(searchString, "i")

  // Create an initial query object to filter categories.
  const query: FilterQuery<typeof Category> = {
    createdBy: userId,
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
    query,
    sortOptions,
    pageSize,
  }
}

const GetCategoriesByUser = async (req: Request, res: Response) => {
  try {
    connectToDB()
    const payload: fetchCategoriesByUserParams = req.body
    // Find the user by the provided email
    const user = await User.findOne({ email: payload.email })

    if (!user)
      return res
        .status(412)
        .json({ message: "User not found", code: "412", data: {} })

    const { query, sortOptions, skipAmount, pageSize } = offsetCalculator({
      ...payload,
      userId: user._id,
    })

    // Create a query to fetch the categories based on the search and sort criteria.
    const organizationsQuery = Category.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)

    // Count the total number of categories that match the search criteria (without pagination).
    const totalCategoriesCount = await Category.countDocuments(query)

    const results: CategoryType[] = await organizationsQuery.exec()

    // Check if there are more results beyond the current page.
    const isNext = totalCategoriesCount > skipAmount + results.length

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
export default GetCategoriesByUser
