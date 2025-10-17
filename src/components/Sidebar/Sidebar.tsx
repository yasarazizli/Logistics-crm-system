import styles from "./Sidebar.module.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { navigation } from "./Sidebar.constants.tsx";
import { FormEvent, useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { logoutRequest } from "@/features/auth/services/auth.service.ts";
import { SiteDarkLogo } from "@/assets/icons/logo.vectors.tsx";
import { LogoutIcon } from "@/assets/icons/sidebar.vectors.tsx";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const { auth, setAuth } = useContext(AuthContext);
  const { setLoader } = useContext(LoaderContext);

  const logOut = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);
    const { status } = await logoutRequest();
    if (status === 200) {
      setAuth({
        isAuth: false,
        role: "",
        user: null,
      });
      document.cookie = `ocrToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      navigate(`/${i18n.language}/auth/login`);
    }
    setLoader(false);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <SiteDarkLogo />
      </div>

      <div className={styles.navigation}>
        <div className={styles.navigation__list}>
          {navigation
            .filter((nav) => nav.roles.includes(auth.role))
            .map((nav, index) => {
              const Icon = nav.icon;
              return (
                <Link
                  to={`/${i18n.language}/${nav.path}`}
                  key={`nav_list_${index}`}
                >
                  <div
                    className={`${styles.icon} ${location.pathname.includes(`/${i18n.language}/${nav.path}`) && styles.active}`}
                  >
                    <Icon />
                    <p>{t(nav.name)}</p>
                  </div>
                </Link>
              );
            })}
        </div>

        <div className={`${styles.navigation__list} ${styles.second}`}>
          <button className={`${styles.icon}`} onClick={logOut}>
            <LogoutIcon />
            <p>{t("main.log__out")}</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
