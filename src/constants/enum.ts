export enum Role {
  Waiter = 'Waiter',
  Chef = 'Chef',
  Manager = 'Manager'
}

export enum DishStatus {
  Available = 'Available',
  Unavailable = 'Unavailable'
}

export enum TableStatus {
  Available = 'Available',
  Hidden = 'Hidden',
  Occupied = 'Occupied'
}

export enum OrderStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Cooked = 'Cooked',
  Served = 'Served',
  Paid = 'Paid',
  Canceled = 'Canceled',
  Rejected = 'Rejected'
}

export enum SocialProvider {
  Google = 'google'
  // Zalo = 'Zalo'
}
