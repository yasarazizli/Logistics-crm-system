import styles from "@/features/dashboard/components/shared/PageTitle/PageTitle.module.scss";
import { useContext } from "react";
import { ThemeContext } from "@/contexts/ThemeContext.tsx";

const PageTitle = ({ title }: { title: string }) => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`${styles.page__title} ${darkMode && styles.dark}`}>
      <p className={styles.title}>{title}</p>
    </div>
  );
};

export default PageTitle;
