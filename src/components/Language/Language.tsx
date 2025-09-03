import styles from "./Language.module.scss";
import { useContext, useEffect, useRef, useState } from "react";
import useClickOutside from "@/hooks/useClickOutside.ts";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  AzerbaijanFlagIcon,
  BritishFlagIcon,
  RussianFlagIcon,
} from "@/assets/icons/shared.vectors.tsx";
import { LanguageIcon } from "@/assets/icons/header.vectors.tsx";
import { allowedLanguage } from "@/components/Language/language.constant.tsx";
import { ThemeContext } from "@/contexts/ThemeContext.tsx";

const Language = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const boxRef = useRef<HTMLDivElement>(null);
  const clickedInside = useClickOutside(boxRef);

  const [active, setActive] = useState<boolean>(false);

  useEffect(() => {
    if (!clickedInside) setActive(false);
  }, [clickedInside]);

  const changeLanguage = async (newLang: string) => {
    const currentLang = location.pathname.split("/")[1];

    if (!allowedLanguage.includes(currentLang)) {
      const defaultLang = i18n.language || "en";
      navigate(`/${defaultLang}${location.pathname.replace(/^\/[^/]+/, "")}`, {
        replace: true,
      });
    } else if (currentLang !== newLang) {
      await i18n.changeLanguage(newLang);
      navigate(`/${newLang}${location.pathname.replace(/^\/[^/]+/, "")}`, {
        replace: true,
      });
    }

    localStorage.setItem("allianceLanguage", newLang);

    setActive(false);
  };

  return (
    <div className={`${styles.language} ${darkMode && styles.dark}`}>
      <div
        className={styles.language__icon}
        onClick={() => {
          setActive((prevState) => !prevState);
        }}
      >
        <LanguageIcon />
      </div>

      <div
        ref={boxRef}
        className={`${styles.language__content} ${active && styles.active}`}
      >
        {/* Azerbaijan language option */}
        {i18n.language !== "az" && (
          <div
            onClick={() => changeLanguage("az")}
            className={`${styles.language__content__option}`}
          >
            <AzerbaijanFlagIcon />
            <span>Azərbaycan</span>
          </div>
        )}

        {/* English language option */}
        {i18n.language !== "en" && (
          <div
            onClick={() => changeLanguage("en")}
            className={`${styles.language__content__option}`}
          >
            <BritishFlagIcon />
            <span>English</span>
          </div>
        )}

        {/* Russian language option */}
        {i18n.language !== "ru" && (
          <div
            onClick={() => changeLanguage("ru")}
            className={`${styles.language__content__option}`}
          >
            <RussianFlagIcon />
            <span>Русский</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Language;
