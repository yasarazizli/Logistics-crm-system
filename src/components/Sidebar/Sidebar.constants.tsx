import {
  SalesIcon,
  UsersIcon,
  VendorIcon,
  ServiceIcon,
  WorkersIcon,
  TasksIcon,
  BalanceActivitiesIcon,
  SettingsIcon,
  // RegionIcon,
  // SalesIcon,
  // CommercialIcon,
  // BuyerIcon,
  // FinancialIcon,
  // VendorIcon,
  // ServiceIcon,
  // TemplatesIcon,
} from "@/assets/icons/sidebar.vectors.tsx";

export const navigation = [
  // Users
  {
    name: "users.title",
    path: "users",
    icon: UsersIcon,
    roles: ["admin", "lawyer", "accountant", "commercial_directory"],
  },

  // Workers
  {
    name: "workers.title",
    path: "workers",
    icon: WorkersIcon,
    roles: ["admin"],
  },

  // Vendors
  {
    name: "vendors.title",
    path: "vendors",
    icon: VendorIcon,
    roles: ["admin", "lawyer", "buyer_manager"],
  },

  // Services
  {
    name: "services.title",
    path: "services",
    icon: ServiceIcon,
    roles: [
      "admin",
      "lawyer",
      "buyer_manager",
      "commercial_directory",
      "monitoring",
    ],
  },

  // Settings
  {
    name: "settings.title",
    path: "settings",
    icon: SettingsIcon,
    roles: ["admin"],
  },

  // Orders
  {
    name: "order.title",
    path: "order",
    icon: SalesIcon,
    roles: [
      "admin",
      "user",
      "commercial_manager",
      "accountant",

      "directory",
      "commercial_directory",
      "accountant",
      "buyer_manager",
    ],
  },

  // Balance Activity
  {
    name: "Balans Fəaliyyətləri",
    path: "balance",
    icon: BalanceActivitiesIcon,
    roles: ["admin", "accountant"],
  },

  // Tasks
  {
    name: "Tasklarım",
    path: "tasks",
    icon: TasksIcon,
    roles: ["admin", "buyer_manager"],
  },
];
