// React
import { useContext } from "react";

// Contexts
import { AuthContext } from "@/contexts/AuthContext.tsx";
import { ThemeContext } from "@/contexts/ThemeContext.tsx";

// Components
import Notification from "@/components/Notification/Notification.tsx";
import Language from "@/components/Language/Language.tsx";
import Switcher from "@/components/Switcher/Switcher.tsx";

// Images & Icons
import {
  CompanyIcon,
  DarkModeIcon,
  LightModeIcon,
} from "@/assets/icons/shared.vectors.tsx";

// Styles
import styles from "@/components/Header/Header.module.scss";

const Header = () => {
  const { auth } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <div className={`${styles.dashboard__header} ${darkMode && styles.dark}`}>
      <div className={styles.buttons}>
        <Switcher
          iconOne={DarkModeIcon}
          iconTwo={LightModeIcon}
          toggle={darkMode}
          onToggle={() => setDarkMode(!darkMode)}
        />

        <div className={styles.button}>
          <Notification />
        </div>

        <div className={`${styles.button} ${styles.language}`}>
          <Language />
        </div>

        <div className={styles.special__button}>
          <CompanyIcon />
          <span>{auth.user?.full_name}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
