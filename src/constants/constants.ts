export const PAGINATION = {
  DEFAUT_PAGE_INDEX: 1,
  DEFAULT_PAGE_SIZE: 10,
};

export const DATE_RANGE_SELECT = {
  MAX_YEAR: 2100,
  MIN_YEAR: 1930,
};

export const OAUTH_LOGIN_ERROR_MESSAGE = "ACCOUNT_NOT_EXIST_IN_SYSTEM";

export const ROUTES = {
  // Public routes
  HOME: "/",
  LOGIN: "/login",
  LOGOUT: "/logout",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESERVATION: "/reservation",

  // Dashboard routes
  DASHBOARD: {
    ROOT: "/dashboard",
    ORDERS: "/dashboard/orders",
    ORDERS_CREATE: "/dashboard/orders/create",
    ORDERS_CHECKOUT: "/dashboard/orders/checkout",
    DISHES: "/dashboard/dishes",
    BILLS: "/dashboard/bills",
    TABLES: "/dashboard/tables",
    ACCOUNTS: "/dashboard/accounts",
    SETTINGS: "/dashboard/settings",
  },

  // Customer routes
  CUSTOMER: {
    ORDERS: "/customer/orders",
  },

  // API routes
  API: {
    AUTH: "/api/auth",
    CUSTOMERS: "/customers",
    CUSTOMERS_AUTH: "/customers/auth",
    CUSTOMERS_AUTH_LOGOUT: "/customers/auth/logout",
  },
} as const;
