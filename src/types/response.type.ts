export interface ISuccessResponse<DataType> {
  statusCode: number
  message: string
  data: DataType
}
