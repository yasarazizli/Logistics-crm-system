// React
import React from "react";

// Images & Icons
import { SiteLightLogo } from "@/assets/icons/logo.vectors.tsx";
import AuthLayoutBg from "@/assets/images/auth/auth_layout_bg.jpg";

// Styles
import styles from "@/features/auth/components/layout/AuthLayout.module.scss";

const AuthLayout = ({
  children,
  changeSide,
}: {
  children: React.ReactNode;
  changeSide?: boolean;
}) => {
  return (
    <main className={`${styles.auth} ${changeSide && styles.active}`}>
      <section className={styles.auth__placeholder}>
        <div className={styles.auth__content__title}>
          <SiteLightLogo />
        </div>
        <img
          className={styles.auth__placeholder__background}
          src={AuthLayoutBg}
          alt=""
        />
      </section>
      <section className={styles.auth__content}>{children}</section>
    </main>
  );
};

export default AuthLayout;
