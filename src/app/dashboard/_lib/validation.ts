import { endOfWeek, startOfToday, startOfWeek } from 'date-fns'
import { vi } from 'date-fns/locale'
import { createSearchParamsCache, parseAsIsoDate } from 'nuqs/server'

export const dashboardSearchParamsCache = createSearchParamsCache({
  from: parseAsIsoDate.withDefault(startOfWeek(startOfToday(), { locale: vi })),
  to: parseAsIsoDate.withDefault(endOfWeek(startOfToday(), { locale: vi }))
})
