export function parseApiResults(results: any) {
  return JSON.parse(JSON.stringify(results))
}

export function calculatePercentageChange(
  currentValue: number,
  previousValue: number
): number {
  // return 0 if previous value is 0
  if (previousValue === 0) return 0

  const change = currentValue - previousValue
  const percentageChange = (change / previousValue) * 100

  return Math.round(percentageChange)
}

export function getWeekNumberInMonth(date: Date): number {
  // Create a new date object to avoid mutating the original
  const inputDate = new Date(date)

  // Set the date to the first day of the month
  inputDate?.setDate(1)

  // Get the day of the week for the first day of the month
  const firstDayOfMonth = inputDate?.getDay()

  // Calculate the day of the month for the given date
  const dayOfMonth = new Date(date)?.getDate()

  // Calculate the week number
  const weekNumber = Math.ceil((dayOfMonth + firstDayOfMonth) / 7)

  return weekNumber >= 4 ? 4 : weekNumber
}

export function extractNameFromEmail(email: string): string {
  // Find the index of the "@" symbol
  const atIndex = email.indexOf("@")

  // If "@" is not found, return an empty string
  if (atIndex === -1) {
    return ""
  }

  // Extract the part of the email before the "@" symbol
  return email.substring(0, atIndex)
}
