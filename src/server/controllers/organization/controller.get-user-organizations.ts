import { Request, Response } from "express"
import User from "../../models/model.user"
import {
  fetchOrganizationsByUserParams,
  Organization as OrganizationType,
} from "../../types/types.organization"
import Organization from "../../models/model.organization"
import { FilterQuery } from "mongoose"
import { defaultGetQuery } from "../../utils/utils.index"
import { parseApiResults } from "../../helpers/helper.index"

const offsetCalculator = ({
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
  searchString = "",
}: fetchOrganizationsByUserParams) => {
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
    skipAmount,
    pageSize,
    query,
    sortOptions,
    pageNumber,
  }
}

const GetUserOrganizations = async (req: Request, res: Response) => {
  try {
    const payload: fetchOrganizationsByUserParams = req.body
    // Find the user with the provided unique email
    const user = await User.findOne({ email: payload.email })

    if (!user)
      return res
        .status(412)
        .json({ message: "User not found", code: "412", data: {} })

    const { sortOptions, query, skipAmount, pageSize, pageNumber } =
      offsetCalculator({
        ...payload,
      })

    // query the user's organizations by fecthing the organization ids in the user model
    const results: OrganizationType[] = (await Organization.find({
      createdBy: user._id.toString(),
      ...defaultGetQuery,
    })
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)) as OrganizationType[]

    // Count the total number of organizations that match the search criteria (without pagination).
    const totalOrganizationsCount = await Organization.find({
      createdBy: user._id.toString(),
    }).countDocuments(query)

    // Check if there are more organizations beyond the current page.
    const isNext = totalOrganizationsCount > skipAmount + results.length
    const totalPages = Math.ceil(totalOrganizationsCount / pageSize)

    return res.status(200).json({
      message: "",
      code: "200",
      data: {
        ...parseApiResults({
          results,
          isNext,
          total: totalOrganizationsCount,
          pageSize,
          pageNumber,
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
export default GetUserOrganizations
