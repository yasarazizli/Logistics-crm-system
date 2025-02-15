// Components
import PageTitle from "@/features/dashboard/components/shared/PageTitle/PageTitle.tsx";

// Styles
import styles from "@/features/dashboard/components/pages/Dashboard.module.scss";
import { useTranslation } from "react-i18next";
import { SettingsCards } from "@/features/dashboard/constants/settings.constant.tsx";
import { useState } from "react";
import CountriesSettings from "@/features/dashboard/components/pages/Settings/CountriesSettings/CountriesSettings.tsx";
import CitiesSettings from "@/features/dashboard/components/pages/Settings/CitiesSettings/CitiesSettings.tsx";
import SelectedCountryAndCity from "@/features/dashboard/components/shared/Modals/Settings/SelectedCountryAndCity.tsx";

const Settings = () => {
  // React
  const { t } = useTranslation();

  const [content, setContent] = useState<string>("");
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
          <div className={styles.dashboard__settings}>
            {SettingsCards.map((item, index) => (
              <div
                onClick={() => {
                  if (item.title === "Cities") {
                    setModals((prevState) => ({
                      ...prevState,
                      cities: true,
                    }));
                  } else {
                    setContent(item.title);
                  }
                }}
                key={`settings__item__${index}`}
                className={styles.settings__item}
              >
                <p className={styles.settings__item__icon}>
                  <item.icon />
                </p>
                <p className={styles.settings__item__title}>{item.title}</p>
              </div>
            ))}
          </div>
        )}

        {content === "Countries" && (
          <CountriesSettings
            changeSettings={() => {
              setContent("");
            }}
          />
        )}

        {content === "Cities" && (
          <CitiesSettings
            country_id={id}
            changeSettings={() => {
              setContent("");
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
              setContent("Cities");
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
