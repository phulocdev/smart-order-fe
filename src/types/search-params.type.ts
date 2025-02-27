export type DateRangeQuery = {
  from?: string
  to?: string
}

export type PaginationQuery = {
  page?: string | number
  limit?: string | number
}

export type OrderSearchParamsType = PaginationQuery &
  DateRangeQuery & {
    sort?: string // createdAt.desc || createdAt.asc
    code?: string
    customer?: string // name
    status?: string
  }
