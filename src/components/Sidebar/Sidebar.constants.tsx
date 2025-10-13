import {
  BalanceActivitiesIcon,
  ControlsIcon,
  HomeIcon,
  HumansIcon,
  LawyerIcon,
  OrdersIcon,
  ServiceIcon,
  TasksIcon,
  VendorIcon,
} from "@/assets/icons/sidebar.vectors.tsx";

export const navigation = [
  {
    name: "main.title",
    path: "users",
    icon: HomeIcon,
    roles: ["admin", "directory"],
  },
  {
    name: "main.title__2",
    path: "vendors",
    icon: HumansIcon,
    roles: ["admin"],
  },
  {
    name: "main.title__2",
    path: "vendors",
    icon: HomeIcon,
    roles: ["buyer_manager"],
  },
  {
    name: "main.title__3",
    path: "employees",
    icon: VendorIcon,
    roles: ["admin", "directory"],
  },
  {
    name: "main.title__4",
    path: "services",
    icon: ServiceIcon,
    roles: ["admin", "buyer_manager"],
  },
  {
    name: "main.title__5",
    path: "orders",
    icon: OrdersIcon,
    roles: ["admin", "directory"],
  },
  {
    name: "main.title__6",
    path: "balance",
    icon: BalanceActivitiesIcon,
    roles: ["admin", "directory"],
  },
  {
    name: "main.title__7",
    path: "tasks",
    icon: TasksIcon,
    roles: ["admin", "directory"],
  },
  {
    name: "main.title__8",
    path: "controls",
    icon: ControlsIcon,
    roles: ["admin", "directory"],
  },

  // lawyer
  {
    name: "main.lawyer",
    path: "lawyer/users",
    icon: LawyerIcon,
    roles: ["lawyer"],
  },

  // User
  {
    name: "main.lawyer",
    path: "users",
    icon: LawyerIcon,
    roles: ["user"],
  },

  //Accountant
  {
    name: "main.lawyer",
    path: "accountant/users",
    icon: LawyerIcon,
    roles: ["accountant"],
  },

  // Commercial Directory
  {
    name: "main.lawyer",
    path: "commercial/directory/users",
    icon: LawyerIcon,
    roles: ["commercial_directory"],
  },
  {
    name: "main.cd_services",
    path: "commercial/directory/services",
    icon: ServiceIcon,
    roles: ["commercial_directory"],
  },

  // Commercial Manager
  {
    name: "main.title__5",
    path: "commercial/manager/order",
    icon: OrdersIcon,
    roles: ["commercial_manager"],
  },

  // Commercial Specialist
  {
    name: "main.title__5",
    path: "commercial/specialist",
    icon: OrdersIcon,
    roles: ["commercial_specialist"],
  },

  // Buyers Directory
  {
    name: "main.title__7",
    path: "buyers/director/tasks",
    icon: TasksIcon,
    roles: ["buyer_directory"],
  },

  // Buyers Manager
  {
    name: "main.title__7",
    path: "buyers/manager/tasks",
    icon: TasksIcon,
    roles: ["buyer_manager"],
  },
];
