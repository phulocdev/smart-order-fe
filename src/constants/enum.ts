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
  Occupied = 'Occupied',
  Hidden = 'Hidden'
}

export enum OrderStatus {
  Rejected = 'Rejected',
  Processing = 'Processing',
  Canceled = 'Canceled',
  Cooked = 'Cooked',
  Served = 'Served',
  Paid = 'Paid'
}
