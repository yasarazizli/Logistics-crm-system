// React
import React, { useContext } from "react";
import { Link } from "react-router-dom";

// Images & Icons
import { SiteLightLogo, SiteDarkLogo } from "@/assets/icons/logo.vectors.tsx";
import AuthLayoutBg from "@/assets/images/auth/auth_layout_bg.jpg";

// Styles
import styles from "@/features/auth/components/layout/AuthLayout.module.scss";
import { ThemeContext } from "@/contexts/ThemeContext.tsx";
import { useTranslation } from "react-i18next";
import Switcher from "@/components/Switcher/Switcher.tsx";
import { DarkModeIcon, LightModeIcon } from "@/assets/icons/shared.vectors.tsx";

const AuthLayout = ({
  children,
  changeSide,
}: {
  children: React.ReactNode;
  changeSide?: boolean;
}) => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { i18n } = useTranslation();

  return (
    <main
      className={`${styles.auth} ${changeSide && styles.active} ${darkMode && styles.dark}`}
    >
      <section className={styles.auth__content}>
        <div className={styles.auth__content__title}>
          <Link to={`/${i18n.language}/auth/login`}>
            {darkMode ? <SiteDarkLogo /> : <SiteLightLogo />}
          </Link>
        </div>
        {children}
      </section>
      <section className={styles.auth__placeholder}>
        <div className={styles.auth__placeholder__switcher}>
          <Switcher
            iconOne={DarkModeIcon}
            iconTwo={LightModeIcon}
            toggle={darkMode}
            onToggle={() => setDarkMode(!darkMode)}
          />
        </div>
        <img
          className={styles.auth__placeholder__background}
          src={AuthLayoutBg}
          alt=""
        />
      </section>
    </main>
  );
};

export default AuthLayout;
