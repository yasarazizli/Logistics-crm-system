import { Route, Routes, useNavigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

// Pages

// Auth Pages
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ForgetPage from "../features/auth/pages/ForgetPage.tsx";
import SuccessPage from "../features/auth/pages/SuccessPage.tsx";
import PriceQuotation from "@/features/auth/components/pages/PriceQuotation/PriceQuotation.tsx";

// Utils Pages
import HomePage from "@/features/dashboard/pages/HomePage.tsx";
import UsersPage from "@/features/dashboard/pages/UsersPage.tsx";
import ProfilePage from "@/features/dashboard/pages/ProfilePage.tsx";

import { allowedLanguage } from "@/components/Language/language.constant.tsx";
import { useContext, useEffect } from "react";
import NotFoundPage from "@/features/not-found/page/NotFoundPage.tsx";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import { useTranslation } from "react-i18next";
import VendorsPage from "@/features/dashboard/pages/VendorsPage.tsx";
import SettingsPage from "@/features/dashboard/pages/SettingsPage.tsx";
import OrdersPage from "@/features/dashboard/pages/OrdersPage.tsx";
import OrderCreatePage from "@/features/dashboard/pages/OrderCreatePage.tsx";
import ServicesPage from "@/features/dashboard/pages/ServicesPage.tsx";
import WorkersPage from "@/features/dashboard/pages/WorkersPage.tsx";
import BalanceActivitiesPage from "@/features/dashboard/pages/BalanceActivitiesPage.tsx";
import TasksPage from "@/features/dashboard/pages/TasksPage.tsx";

const AppRoutes = () => {
  const { auth } = useContext(AuthContext);
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === `/`) {
      if (auth.isAuth) {
        navigate(`/${i18n.language}/home`);
      } else {
        navigate(`/${i18n.language}/auth/login`);
      }
    }

    if (!allowedLanguage.includes(location.pathname.split("/")[1])) {
      if (auth.isAuth) {
        navigate(`/en/${location.pathname.split("/")[2]}`);
      } else {
        localStorage.setItem("allianceLanguage", i18n.language);
      }
      navigate(
        `/en/${location.pathname.split("/")[2]}/${location.pathname.split("/")[3]}`,
      );
    }

    if (
      localStorage.getItem("allianceLanguage") !==
      location.pathname.split("/")[1]
    ) {
      i18n.changeLanguage(location.pathname.split("/")[1]).catch((err) => {
        console.log(err);
      });
      localStorage.setItem("allianceLanguage", location.pathname.split("/")[1]);
      navigate(
        `/${location.pathname.split("/")[1]}/${location.pathname.split("/")[2]}/${location.pathname.split("/")[3]}`,
      );
    }
  }, [location.pathname, i18n.language]);

  return (
    <Routes>
      {/* Non Privet Route */}
      <Route path="/:lang/auth">
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forget" element={<ForgetPage />} />
        <Route path="success" element={<SuccessPage />} />
        <Route path="price/quotation" element={<PriceQuotation />} />
      </Route>

      {/* Privet Route */}
      <Route path="/:lang" element={<PrivateRoute />}>
        <Route path="home" element={<HomePage />} />

        <Route path="users" element={<UsersPage />} />
        <Route path="workers" element={<WorkersPage />} />

        <Route path="order">
          <Route index element={<OrdersPage />} />
          <Route path="create" element={<OrderCreatePage />} />
          <Route path="update" element={<OrderCreatePage />} />
        </Route>

        <Route path="vendors" element={<VendorsPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="balance" element={<BalanceActivitiesPage />} />

        <Route path="tasks" element={<TasksPage />} />

        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
