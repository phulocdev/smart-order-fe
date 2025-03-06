export type TQueryParams = DateRangeQuery &
  PaginationQuery & {
    [key: string]: string
  }

export type DateRangeQuery = {
  from?: string
  to?: string
}

export type PaginationQuery = {
  page?: string | number
  limit?: string | number
}

export type OrderQuery = DateRangeQuery &
  PaginationQuery & {
    sort?: string // createdAt.desc || createdAt.asc
    code?: string
    customerCode?: string // code
    status?: string
  }
