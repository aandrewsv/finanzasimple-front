// src/lib/utils/dates.ts
import { 
    startOfToday, 
    endOfToday, 
    startOfWeek, 
    endOfWeek,
    startOfMonth,
    endOfMonth,
    subMonths,
    format 
  } from "date-fns"
  import { es } from "date-fns/locale"
  
  type TimeRange = "today" | "week" | "month" | "lastMonth"
  
  export function getDateRangeFromTimeRange(timeRange: TimeRange) {
    const today = new Date()
  
    switch (timeRange) {
      case "today":
        return {
          start: format(startOfToday(), "yyyy-MM-dd"),
          end: format(endOfToday(), "yyyy-MM-dd")
        }
      case "week":
        return {
          start: format(startOfWeek(today, { locale: es }), "yyyy-MM-dd"),
          end: format(endOfWeek(today, { locale: es }), "yyyy-MM-dd")
        }
      case "month":
        return {
          start: format(startOfMonth(today), "yyyy-MM-dd"),
          end: format(endOfMonth(today), "yyyy-MM-dd")
        }
      case "lastMonth":
        const lastMonth = subMonths(today, 1)
        return {
          start: format(startOfMonth(lastMonth), "yyyy-MM-dd"),
          end: format(endOfMonth(lastMonth), "yyyy-MM-dd")
        }
    }
  }