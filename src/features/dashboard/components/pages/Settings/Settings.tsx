// Components
import PageTitle from "@/features/dashboard/components/shared/PageTitle/PageTitle.tsx";

// Styles
import styles from "@/features/dashboard/components/pages/Dashboard.module.scss";
import { useTranslation } from "react-i18next";
import { SettingsCards } from "@/features/dashboard/constants/settings.constant.tsx";
import { useContext, useState } from "react";
import CountriesSettings from "@/features/dashboard/components/pages/Settings/CountriesSettings/CountriesSettings.tsx";
import SelectedCountryAndCity from "@/features/dashboard/components/shared/Modals/Settings/SelectedCountryAndCity.tsx";
import Button from "@/components/Button/Button.tsx";
import { ThemeContext } from "@/contexts/ThemeContext.tsx";
import StationsSettings from "@/features/dashboard/components/pages/Settings/StationsSettings/StationsSettings.tsx";
import HSCodeSettings from "@/features/dashboard/components/pages/Settings/HSCodeSettings/HSCodeSettings.tsx";

const Settings = () => {
  // React
  const { t } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  const [content, setContent] = useState<number | null>(null);
  const [id, setId] = useState<number>(0);
  const [modals, setModals] = useState<{
    cities: boolean;
  }>({
    cities: false,
  });

  return (
    <>
      {/* Page Content START */}
      <div className={styles.dashboard}>
        <PageTitle title={t("settings.title")} />

        {!content && (
          <div
            className={`${styles.dashboard__settings} ${darkMode && styles.dark}`}
          >
            {SettingsCards.map((item, index) => (
              <div
                onClick={() => {
                  if (item.id === 2) {
                    setModals((prevState) => ({
                      ...prevState,
                      cities: true,
                    }));
                  } else {
                    setContent(item.id);
                  }
                }}
                key={`settings__item__${index}`}
                className={styles.settings__item}
              >
                <div className={styles.settings__item__content}>
                  <p className={styles.settings__item__content__title}>
                    {item.title}
                  </p>

                  <Button text={"Kecid edi"} />
                </div>
                <div className={styles.settings__item__icon}>
                  <item.icon />
                </div>
              </div>
            ))}
          </div>
        )}

        {content === 1 && (
          <CountriesSettings
            changeSettings={() => {
              setContent(null);
            }}
          />
        )}

        {content === 2 && (
          <StationsSettings
            country_id={id}
            changeSettings={() => {
              setContent(null);
            }}
          />
        )}

        {content === 3 && (
          <HSCodeSettings
            changeSettings={() => {
              setContent(null);
            }}
          />
        )}

        {/*{content === "Stations" && <CountriesSettings />}*/}

        {modals.cities && (
          <SelectedCountryAndCity
            selected_id={(id) => {
              setModals((prevState) => ({
                ...prevState,
                cities: false,
              }));
              setId(id);
              setContent(2);
            }}
            modalClose={() => {
              setModals((prevState) => ({
                ...prevState,
                cities: false,
              }));
            }}
          />
        )}
      </div>
      {/* Page Content END */}
    </>
  );
};

export default Settings;
