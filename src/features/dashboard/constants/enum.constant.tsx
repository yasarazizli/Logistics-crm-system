// Contract Status Enum
export enum ContractStatus {
  verified,
  unverified,
  empty,
  monitoring,
}

// Roles Enum
export enum Roles {
  lawyer = "lawyer",
  accountant = "accountant",
  buyer_manager = "buyer_manager",
  commercial_manager = "commercial_manager",
  commercial_directory = "commercial_director",
  admin = "admin",
  user = "user",
  director = "director",
  monitoring = "monitoring",
}

// Transport Type
export enum Transport {
  truck = "truck",
  filder = "filder",
  plane = "plane",
  railway = "railway",
}

// Order Status
export enum OrderStatus {
  pending = "pending",
  processing = "Processing",
}

// Invoice Status Enum
export enum InvoiceStatus {
  waiting,
  approved,
  reject,
}
