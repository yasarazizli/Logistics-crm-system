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
import { NotificationIconSidebar } from "@/assets/icons/header.vectors.tsx";

export const navigation = [
  {
    name: "main.title",
    path: "admin/users",
    icon: HomeIcon,
    roles: ["admin"],
  },

  {
    name: "main.title__5",
    path: "buyers/manager/order",
    icon: HomeIcon,
    roles: ["buyer_manager"],
  },
  {
    name: "main.title__2",
    path: "vendors",
    icon: HumansIcon,
    roles: ["admin", "buyer_manager"],
  },
  {
    name: "main.title__3",
    path: "employees",
    icon: VendorIcon,
    roles: ["admin"],
  },
  {
    name: "main.title__4",
    path: "services",
    icon: ServiceIcon,
    roles: ["admin", "buyer_manager"],
  },
  {
    name: "main.title__8",
    path: "controls",
    icon: ControlsIcon,
    roles: ["admin"],
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
  {
    name: "main.title__5",
    path: "accountant/order",
    icon: OrdersIcon,
    roles: ["accountant"],
  },
  {
    name: "main.title__6",
    path: "accountant/balance",
    icon: BalanceActivitiesIcon,
    roles: ["accountant", "admin"],
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
  {
    name: "main.title__5",
    path: "commercial/director/orders",
    icon: OrdersIcon,
    roles: ["commercial_directory"],
  },

  // Commercial Manager
  {
    name: "main.title__5",
    path: "commercial/manager/order",
    icon: OrdersIcon,
    roles: ["admin"],
  },
  {
    name: "main.title__5",
    path: "commercial/manager/order",
    icon: HomeIcon,
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
    icon: HomeIcon,
    roles: ["buyer_directory"],
  },

  // Buyers Manager

  {
    name: "main.title__7",
    path: "buyers/manager/tasks",
    icon: TasksIcon,
    roles: ["buyer_manager", "admin"],
  },

  // Monitoring
  {
    name: "main.title__5",
    path: "monitoring",
    icon: OrdersIcon,
    roles: ["monitoring"],
  },
  {
    name: "main.title__4",
    path: "monitoring/services",
    icon: ServiceIcon,
    roles: ["monitoring"],
  },

  {
    name: "Notification",
    path: "notification",
    icon: NotificationIconSidebar,
    roles: [
      "admin",
      "lawyer",
      "accountant",
      "buyer_manager",
      "commercial_manager",
      "commercial_directory",
      "commercial_specialist",
      "admin",
      "user",
      "monitoring",
      "buyer_directory",
    ],
  },
];
