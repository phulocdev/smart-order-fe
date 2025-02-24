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
  Processing = 'Processing',
  Cooked = 'Cooked',
  Served = 'Served',
  Rejected = 'Rejected',
  Canceled = 'Canceled',
  Paid = 'Paid'
}
