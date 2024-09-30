import { FilterOptions } from "./types.pagination"

export type ISale = {
  _id?: string
  orderNumber: string
  inoviceNumber: string
  amount: number
  cashTendered?: number
  customerName?: string
  customerPhone?: string
  createdBy: string
  organization: string
  createdAt?: Date
  isDeleted?: boolean
  saleItems: ISaleItem[]
  paymentMethod?: PaymentMethod
  status?: SaleStatus
  paidAt?: Date
  note?: string
}

export type ISaleItem = {
  productId?: string
  _id?: string
  name: string
  saleItemNumber: string
  orderInoviceNumber: string
  product: string
  quantity: number
  sellingPrice: number
  amount: number
  organizationId: string
  createdBy?: string
  createdAt?: Date
  isDeleted?: boolean
}

export enum SaleStatus {
  PAID = "paid",
  UNPAID = "unpaid",
  FAILED = "failed",
  CANCELLED = "cancelled",
  ALL = "",
}

export enum PaymentMethod {
  CASH = "cash",
  CARD = "card",
  MOBILE_MONEY = "mobile_money",
}

export enum SalesPeriod {
  TODAY = "today",
  YESTERDAY = "yesterday",
  THIS_WEEK = "this_week",
  LAST_7_DAYS = "last_7_days",
  LAST_30_DAYS = "last_30_days",
  THIS_MONTH = "this_month",
  LAST_MONTH = "last_month",
  THIS_YEAR = "this_year",
}

export type SaleFilterOptions = FilterOptions & {
  status?: SaleStatus
  email: string
  organizationId: string
  period?: SalesPeriod | undefined
  startDate?: Date | string
  endDate?: Date | string
}

export type GetSalesMadeInAPeriodResponse = {
  sales: ISale[]
  totalSales: number
  totalSalesAmount: number
}

export interface getSalesAnalyticsResponse {
  sales: ISale[]
  totalSales: number
  totalSalesAmount: number
  totalSalesAmountForToday: number
  totalSalesAmountForThisWeek: number
  totalSalesAmountForThisMonth: number
  totalSalesAmountForThisYear: number
  salesPerHour: SalesPer[]
  salesPerDayOfWeek: SalesPer[]
  salesPerWeekOfMonth: SalesPer[]
  salesPerMonthOfYear: SalesPer[]
  percentageIncreaseOrDecreaseForToday: number
  percentageIncreaseOrDecreaseForThisWeek: number
  percentageIncreaseOrDecreaseForThisMonth: number
  percentageIncreaseOrDecreaseForThisYear: number
}

export interface SalesPer {
  label: Date
  value: number
}

export enum SalesPeriodTabFilter {
  "12-months" = "12-months",
  "30-days" = "30-days",
  "7-days" = "7-days",
  "24-hours" = "24-hours",
}
