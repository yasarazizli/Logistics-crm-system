import React from "react";
import Header from "@/components/Header/Header.tsx";
import Sidebar from "@/components/Sidebar/Sidebar.tsx";

import styles from "./DashboardLayout.module.scss";

const DashboardLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className={styles.dashboard__layout}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.inner}>
        <Header />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
