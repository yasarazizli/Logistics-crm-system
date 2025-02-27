import React, { useContext } from "react";
import styles from "./Tabs.module.scss";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ThemeContext } from "@/contexts/ThemeContext.tsx";

const Tabs = ({ tabs, active }: { tabs: Array<any>; active?: number }) => {
  const { t, i18n } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`${styles.tabs} ${darkMode && styles.dark}`}>
      {tabs &&
        tabs.map((tab, index) => {
          return (
            <React.Fragment key={`tab_${index}`}>
              {tab?.link ? (
                <Link
                  to={`/${i18n.language}/auth/${tab.link}`}
                  className={`${styles.tab} ${tab.tab === active && styles.active}`}
                  onClick={() => {
                    if (tab.onClick) tab.onClick();
                  }}
                >
                  <span>{t(tab.name)}</span>
                </Link>
              ) : (
                <>
                  <button
                    className={`${styles.tab} ${tab.tab === active && styles.active}`}
                    onClick={() => {
                      if (tab.onClick) tab.onClick();
                    }}
                  >
                    <span>{t(tab.name)}</span>
                  </button>
                </>
              )}
            </React.Fragment>
          );
        })}
    </div>
  );
};

export default Tabs;
