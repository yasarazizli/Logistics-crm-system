import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.tsx";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

// Context

export default function PrivateRoute() {
  const location = useLocation();
  const { auth } = useContext(AuthContext);
  const { i18n } = useTranslation();

  const normalizedPath = `/${location.pathname.replace(/^\/[^\/]+\//, "")}`;

  if (!auth.isAuth) {
    return <Navigate to={`/${i18n.language}/auth/login`} />;
  }

  // İstifatəçi
  if (auth.role === "user") {
    const accessiblePages = [
      "/order",
      "/order/create",
      "/order/update",

      "/settings",
    ];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/order`} />;
    }
  }

  // Hüquqşunas
  if (auth.role === "lawyer") {
    const accessiblePages = [
      "/home",
      "/users",

      "/vendors",
      "/services",

      "/settings",
    ];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/home`} />;
    }
  }

  // Maliyəçi
  if (auth.role === "accountant") {
    const accessiblePages = [
      "/home",
      "/users",
      "/balance",
      "/order",
      "/settings",
    ];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/users`} />;
    }
  }

  // Alış
  if (auth.role === "buyer_manager") {
    const accessiblePages = [
      "/vendors",
      "/services",
      "/tasks",

      "/order",
      "/order/update",
      "/settings",
    ];
    console.log(normalizedPath);
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/vendors`} />;
    }
  }

  // Komersiya Direktoru
  if (auth.role === "commercial_directory") {
    const accessiblePages = ["/users", "/order", "/services", "/settings"];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/order`} />;
    }
  }

  // Admin
  if (auth.role === "admin") {
    const accessiblePages = [
      "/home",
      "/users",
      "/workers",
      "/balance",
      "/price",

      "/vendors",
      "/tasks",
      "/services",
      "/location",

      "/order",
      "/order/create",
      "/order/update",

      "/settings",
    ];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/home`} />;
    }
  }

  // // Direktor
  // if (auth.role === "directory") {
  //   const accessiblePages = [
  //     "/settings",
  //     "balance",
  //     "/order",
  //     "/order/create",
  //     "/order/update",
  //   ];
  //   if (!accessiblePages.includes(normalizedPath)) {
  //     return <Navigate to={`/${i18n.language}/order`} />;
  //   }
  // }
  //
  //
  // // Komersiya manageri
  // if (auth.role === "commercial_manager") {
  //   const accessiblePages = [
  //     "/order",
  //     "/order/create",
  //     "/order/update",
  //     `/settings`,
  //   ];
  //
  //   if (!accessiblePages.includes(normalizedPath)) {
  //     return <Navigate to={`/${i18n.language}/order`} />;
  //   }
  // }
  //
  // if (auth.role === "sales_manager") {
  //   const accessiblePages = ["/order", "/order/update"];
  //
  //   if (!accessiblePages.includes(normalizedPath)) {
  //     return <Navigate to={`/${i18n.language}/order`} />;
  //   }
  // }
  //

  //
  // // Maliyəçi
  // if (auth.role === "accountant") {
  //   const accessiblePages = ["/order", "/financial", "/settings"];
  //   if (!accessiblePages.includes(normalizedPath)) {
  //     return <Navigate to={`/${i18n.language}/financial`} />;
  //   }
  // }

  return <Outlet />;
}
