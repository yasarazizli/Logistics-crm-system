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

import ProfilePage from "@/features/dashboard/pages/Others/ProfilePage.tsx";

import { allowedLanguage } from "@/components/Language/language.constant.tsx";
import { useContext, useEffect } from "react";
import NotFoundPage from "@/features/not-found/page/NotFoundPage.tsx";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import { useTranslation } from "react-i18next";

import EmailSuccessPage from "@/features/auth/pages/EmailSuccessPage.tsx";
import RegisterSuccessPage from "@/features/auth/pages/RegisterSuccessPage.tsx";
import ControlsPage from "@/features/dashboard/pages/Controls/ControlsPage.tsx";
import HsCodePage from "@/features/dashboard/pages/Controls/HsCodePage.tsx";
import CountryPage from "@/features/dashboard/pages/Controls/CountryPage.tsx";
import StationPage from "@/features/dashboard/pages/Controls/StationPage.tsx";
import CityPage from "@/features/dashboard/pages/Controls/CityPage.tsx";
import EmployeesPage from "@/features/dashboard/pages/Employees/EmployeesPage.tsx";
import PortPage from "@/features/dashboard/pages/Controls/PortPage.tsx";
import UsersPage from "@/features/dashboard/pages/Others/UsersPage.tsx";
import LawyerPage from "@/features/dashboard/pages/Lawyer/LawyerPage.tsx";
import AccountantUserPage from "@/features/dashboard/pages/Accountant/AccountantUserPage.tsx";
import ServicesPage from "@/features/dashboard/pages/Services/ServicesPage.tsx";
import VendorPage from "@/features/dashboard/pages/Vendor/VendorPage.tsx";
import CommercialDirectoryUserPage from "@/features/dashboard/pages/CommercialDirectory/CommercialDirectoryUser/CommercialDirectoryUserPage.tsx";
import CommercialDirectoryServicesPage from "@/features/dashboard/pages/CommercialDirectory/CommercialDirectoryServices/CommercialDirectoryServicesPage.tsx";
import PriceRegisterPage from "@/features/auth/pages/PriceRegisterPage.tsx";
import CommercialManagerOrderPage from "@/features/dashboard/pages/CommercialManager/CommercialManagerOrder/ComercialManagerOrderPage.tsx";
import CustomerInformationPage from "@/features/dashboard/pages/CommercialManager/CustomerInformation/CustomerInformationPage.tsx";
import OfferPage from "@/features/dashboard/pages/Others/OfferPage.tsx";
import CustomerInformationEditPage from "@/features/dashboard/pages/CommercialManager/CustomerInformationEdit/CustomerInformationEditPage.tsx";
import AskQuotationPage from "@/features/dashboard/pages/Others/AskQuotationPage.tsx";
import CommercialSpecialistPage from "@/features/dashboard/pages/CommercialSpecialist/CommercialSpecialistPage.tsx";
import TasksPage from "@/features/dashboard/pages/BuyersDirector/Tasks/TasksPage.tsx";
import AskQuotationEditPage from "@/features/dashboard/pages/Others/AskQuotationEditPage.tsx";
import ManagerTasksPage from "@/features/dashboard/pages/BuyersManager/Tasks/ManagerTasksPage.tsx";
import DetailsPage from "@/features/dashboard/pages/BuyersManager/Details/DetailsPage.tsx";
import MonitoringPage from "@/features/dashboard/pages/Monitoring/MonitoringPage.tsx";
import OrderMonitoringPage from "@/features/dashboard/pages/Monitoring/OrderMonitoring/OrderMonitoringPage.tsx";
import OrderPage from "@/features/dashboard/pages/BuyersManager/Order/OrderPage.tsx";
import SubCodePage from "@/features/dashboard/pages/BuyersManager/Order/SubCode/SubCodePage.tsx";
import BalancePage from "@/features/dashboard/pages/Accountant/Balance/BalancePage.tsx";
import ServicesMonitoringPage from "@/features/dashboard/pages/Monitoring/ServicesMonitoring/ServicesMonitoringPage.tsx";
import AccountantOrderPage from "@/features/dashboard/pages/Accountant/Order/AccountantOrderPage.tsx";
import CommercialDirectoryOrderPage from "@/features/dashboard/pages/CommercialDirectory/CommercialDirectoryOrder/CommercialDirectoryOrderPage.tsx";
import OrdersPage from "@/features/dashboard/pages/CommercialDirectory/CommercialDirectoryOrder/OrdersPage.tsx";
import AskOrderPage from "@/features/dashboard/pages/Others/AksOrderPage.tsx";
import AskOrderEditPage from "@/features/dashboard/pages/Others/AskOrderEditPage.tsx";
import AdminUsersPage from "@/features/dashboard/pages/Admin/Users/AdminUsersPage.tsx";
import VerifyRedirectPage from "@/features/auth/pages/VerifyRedirectPage.tsx";
import RegisterExpiredPage from "@/features/auth/pages/RegisterExpiredPage.tsx";
import NotificationPage from "@/features/dashboard/pages/Notification/NotificationPage.tsx";
import ExtraChangePage from "@/features/dashboard/pages/CommercialManager/ExtraChange/ExtraChangePage.tsx";

const AppRoutes = () => {
  const { auth } = useContext(AuthContext);
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === `/`) {
      if (auth.isAuth) {
        navigate(`/${i18n.language}/users`);
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
        <Route path="price/register" element={<PriceRegisterPage />} />
        <Route path="forget" element={<ForgetPage />} />
        <Route path="success" element={<SuccessPage />} />
        <Route path="emailsuccess" element={<EmailSuccessPage />} />
        <Route path="registersuccess" element={<RegisterSuccessPage />} />
        <Route path="price/quotation" element={<PriceQuotation />} />
        <Route path="registerverify" element={<VerifyRedirectPage />} />
        <Route path="registerexpired" element={<RegisterExpiredPage />} />
      </Route>

      {/* Privet Route */}
      <Route path="/:lang" element={<PrivateRoute />}>
        <Route path="users" element={<UsersPage />} />
        <Route path="notification" element={<NotificationPage />} />
        <Route path="lawyer/users" element={<LawyerPage />} />
        <Route path="accountant/users" element={<AccountantUserPage />} />
        <Route path="accountant/order" element={<AccountantOrderPage />} />
        <Route path="accountant/balance" element={<BalancePage />} />
        <Route path="admin/users" element={<AdminUsersPage />} />
        <Route
          path="commercial/directory/users"
          element={<CommercialDirectoryUserPage />}
        />
        <Route
          path="commercial/director/order"
          element={<CommercialDirectoryOrderPage />}
        />
        <Route path="commercial/director/orders" element={<OrdersPage />} />
        <Route path="users/ask/order" element={<AskQuotationPage />} />
        <Route path="users/ask/quotation" element={<AskOrderPage />} />
        <Route
          path="users/ask/quotation/update"
          element={<AskOrderEditPage />}
        />
        <Route
          path="users/ask/quotation/edit"
          element={<AskQuotationEditPage />}
        />
        <Route
          path="commercial/manager/order"
          element={<CommercialManagerOrderPage />}
        />
        <Route path="commercial/extra/change" element={<ExtraChangePage />} />
        <Route
          path="commercial/specialist"
          element={<CommercialSpecialistPage />}
        />
        <Route
          path="commercial/manager/information"
          element={<CustomerInformationPage />}
        />
        <Route
          path="commercial/manager/information/edit"
          element={<CustomerInformationEditPage />}
        />
        <Route path="buyers/director/tasks" element={<TasksPage />} />
        <Route path="buyers/manager/tasks" element={<ManagerTasksPage />} />
        <Route path="buyers/manager/order" element={<OrderPage />} />
        <Route path="buyers/manager/order/subcode" element={<SubCodePage />} />
        <Route path="buyers/details" element={<DetailsPage />} />
        <Route path="user/offer/confirmation" element={<OfferPage />} />
        <Route path="monitoring" element={<MonitoringPage />} />
        <Route path="monitoring/order" element={<OrderMonitoringPage />} />
        <Route
          path="monitoring/services"
          element={<ServicesMonitoringPage />}
        />
        <Route
          path="commercial/directory/services"
          element={<CommercialDirectoryServicesPage />}
        />
        <Route path="controls">
          <Route index element={<ControlsPage />} />
          <Route path="hscode" element={<HsCodePage />} />
          <Route path="country" element={<CountryPage />} />
          <Route path="station" element={<StationPage />} />
          <Route path="port" element={<PortPage />} />
          <Route path="city" element={<CityPage />} />
        </Route>
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="vendors" element={<VendorPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
