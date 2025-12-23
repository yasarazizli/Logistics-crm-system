import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.tsx";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Roles } from "@/features/dashboard/constants/enum.constant.tsx";

export default function PrivateRoute() {
  const location = useLocation();
  const { auth } = useContext(AuthContext);
  const { i18n } = useTranslation();

  const normalizedPath = `/${location.pathname.replace(/^\/[^/]+\//, "")}`;

  if (!auth.isAuth) {
    return <Navigate to={`/${i18n.language}/auth/login`} />;
  }

  // User
  if (auth.role === Roles.user) {
    const accessiblePages = [
      "/admin/users",
      "/users",
      "/user/offer/confirmation",
      "/users/ask/quotation",
      "/users/ask/order",
      "/users/ask/quotation/edit",
      "/users/ask/quotation/update",
      "/notification",
    ];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/users`} />;
    }
  }

  // Lawyer
  if (auth.role === Roles.lawyer) {
    const accessiblePages = ["/lawyer/users", "/notification"];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/lawyer/users`} />;
    }
  }

  // Accountant
  if (auth.role === Roles.accountant) {
    const accessiblePages = [
      "/accountant/users",
      "/accountant/balance",
      "/accountant/order",
      "/notification",
    ];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/accountant/users`} />;
    }
  }

  // Buyer Manager
  if (auth.role === Roles.buyer_manager) {
    const accessiblePages = [
      "/services",
      "/vendors",
      "/buyers/manager/tasks",
      "/buyers/details",
      "/buyers/manager/order",
      "/buyers/manager/order/subcode",
      "/notification",
    ];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/vendors`} />;
    }
  }

  // Commercial Directory
  if (auth.role === Roles.commercial_directory) {
    const accessiblePages = [
      "/commercial/directory/users",
      "/commercial/directory/services",
      "/commercial/director/order",
      "/commercial/director/orders",
      "/notification",
    ];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/commercial/directory/users`} />;
    }
  }

  // Commercial Manager
  if (auth.role === Roles.commercial_manager) {
    const accessiblePages = [
      "/commercial/manager/order",
      "/commercial/manager/information",
      "/commercial/manager/information/edit",
      "/notification",
    ];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/commercial/manager/order`} />;
    }
  }

  // Commercial Specialist
  if (auth.role === Roles.commercial_specialist) {
    const accessiblePages = [
      "/commercial/specialist",
      "/commercial/manager/information",
      "/commercial/manager/information/edit",
      "/notification",
    ];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/commercial/specialist`} />;
    }
  }

  // Director
  if (auth.role === Roles.buyer_directory) {
    const accessiblePages = ["/buyers/director/tasks", "/notification"];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/buyers/director/tasks`} />;
    }
  }

  // Monitoring
  if (auth.role === Roles.monitoring) {
    const accessiblePages = [
      "/monitoring",
      "/monitoring/order",
      "/monitoring/services",
      "/notification",
    ];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/monitoring`} />;
    }
  }

  if (auth.role === Roles.admin) {
    return <Outlet />;
  }

  return <Outlet />;
}
