export enum ENV {
  PRODUCTION = "production",
  DEVELOPMENT = "development",
  TEST = "test",
}

export enum STATUS {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED",
  BLOCKED = "BLOCK",
  UNBLOCKED = "UNBLOCKED"
}

export enum NOTIFICATION {
  DELETED = "DELETED",
  READ = "READ",
  UNREAD = "UNREAD",
  SEND = "SEND",
}

export enum USER_TYPE {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  SYSTEM = "SYSTEM",
}

export enum PRODUCT_TYPE {
  REFUND = "REFUND",
  SUBSCRIPTION = "SUBSCRIPTION",
}

export enum COOKIE_NAME {
  TOKEN = "token", // this token is used for authentication.
}
