import React from "react";
import styles from "./Tabs.module.scss";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Tabs = ({ tabs, active }: { tabs: Array<any>; active?: number }) => {
  const { t, i18n } = useTranslation();

  return (
    <div className={styles.tabs}>
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
