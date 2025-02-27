import styles from "@/features/dashboard/components/pages/Order/OrderCreate/RouteEditor/RouteEditor.module.scss";
import { useContext } from "react";
import { ThemeContext } from "@/contexts/ThemeContext.tsx";

type SectionHeadProps = {
  icon?: any;
  size?: "s" | "m" | "l";
  name: string;
};

const SectionHead = ({ icon: Icon, name, size }: SectionHeadProps) => {
  const { darkMode } = useContext(ThemeContext);
  return (
    <div
      className={`${styles.section__head} ${size === "s" ? styles.small : size === "m" ? styles.medium : styles.large} ${darkMode && styles.dark}`}
    >
      {Icon && <Icon />}
      <p>{name}</p>
    </div>
  );
};

export default SectionHead;
