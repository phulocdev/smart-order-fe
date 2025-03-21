export enum Role {
  Waiter = 'Waiter',
  Chef = 'Chef',
  Manager = 'Manager'
}

export enum DishStatus {
  Available = 'Available',
  Unavailable = 'Unavailable',
  Hidden = 'Hidden'
}

export enum TableStatus {
  Available = 'Available',
  Reserved = 'Reserved',
  Hidden = 'Hidden',
  Occupied = 'Occupied'
}

export enum OrderStatus {
  Pending = 'Pending', // Đơn hàng mới tạo, chờ nhân viên xác nhận
  Confirmed = 'Confirmed', // Nhân viên đã xác nhận đơn
  Preparing = 'Preparing', // Bếp đang chuẩn bị món ăn
  ReadyToServe = 'ReadyToServe', // Món ăn đã sẵn sàng để phục vụ
  Served = 'Served', // Đã mang món ra bàn cho khách
  Cooked = 'Cooked',
  Paid = 'Paid', // Khách đã thanh toán
  Canceled = 'Canceled', // Đơn hàng bị hủy (do khách hoặc nhà hàng)
  Rejected = 'Rejected' // Đơn hàng bị từ chối (hết món hoặc lý do khác)
}

export enum SocialProvider {
  Google = 'google'
  // Zalo = 'Zalo'
}
