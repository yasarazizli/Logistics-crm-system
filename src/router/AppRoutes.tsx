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
      </Route>

      {/* Privet Route */}
      <Route path="/:lang" element={<PrivateRoute />}>
        <Route path="users" element={<UsersPage />} />
        <Route path="lawyer/users" element={<LawyerPage />} />
        <Route path="accountant/users" element={<AccountantUserPage />} />
        <Route
          path="commercial/directory/users"
          element={<CommercialDirectoryUserPage />}
        />
        <Route path="users/ask/quotation" element={<AskQuotationPage />} />
        <Route
          path="users/ask/quotation/edit"
          element={<AskQuotationEditPage />}
        />
        <Route
          path="commercial/manager/order"
          element={<CommercialManagerOrderPage />}
        />
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
        <Route path="user/offer/confirmation" element={<OfferPage />} />
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
