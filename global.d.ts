declare global {
  namespace Backend {
    interface ISuccessResponse<DataType> {
      statusCode: number
      message: string
      data: DataType
    }
  }
}
