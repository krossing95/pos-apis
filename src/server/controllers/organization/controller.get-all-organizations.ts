import { Request, Response } from "express"
import { connectToDB } from "../../config/config.db"
import {
  fetchAllOrganizationsParams,
  Organization as OrganizationType,
} from "../../types/types.organization"
import { defaultGetQuery } from "../../utils/utils.index"
import { FilterQuery } from "mongoose"
import Organization from "../../models/model.organization"

const offsetCalculator = ({
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
  searchString = "",
}: fetchAllOrganizationsParams) => {
  // Calculate the number of organizations to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize

  // Create a case-insensitive regular expression for the provided search string.
  const regex = new RegExp(searchString, "i")

  // Create an initial query object to filter organizations.
  const query: FilterQuery<typeof Organization> = {
    ...defaultGetQuery,
  }

  // If the search string is not empty, add the $or operator to match either username or name fields.
  if (searchString.trim() !== "") {
    query.$or = [{ username: { $regex: regex } }, { name: { $regex: regex } }]
  }

  // Define the sort options for the fetched organizations based on createdAt field and provided sort order.
  const sortOptions = { createdAt: sortBy }

  return {
    pageSize,
    sortOptions,
    query,
    skipAmount,
  }
}

const GetAllOrganizations = async (req: Request, res: Response) => {
  try {
    connectToDB()

    const payload: fetchAllOrganizationsParams = req.body

    const { query, sortOptions, skipAmount, pageSize } = offsetCalculator({
      ...payload,
    })
    // Create a query to fetch the organizations based on the search and sort criteria.
    const organizationsQuery = Organization.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)
      .populate("members")

    // Count the total number of organizations that match the search criteria (without pagination).
    const totalOrganizationsCount = await Organization.countDocuments(query)

    const organizations: OrganizationType[] = await organizationsQuery.exec()

    // Check if there are more organizations beyond the current page.
    const isNext = totalOrganizationsCount > skipAmount + organizations.length

    return res
      .status(200)
      .json({ message: "", code: "200", data: { organizations, isNext } })
  } catch (error) {
    return res.status(500).json({
      message: "Whoops! Something went wrong",
      code: "500",
      data: {},
    })
  }
}
export default GetAllOrganizations
