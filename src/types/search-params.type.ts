export type DateRangeQuery = {
  fromDate: string
  toDate: string
}

export type PaginationQuery = {
  page: string
  limit: string
}

export type OrderSearchParamsType = {
  page: string
  sort: string // createdAt.desc || createdAt.asc
}
