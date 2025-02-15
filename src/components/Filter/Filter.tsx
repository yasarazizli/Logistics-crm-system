import styles from "./Filter.module.scss";
import Tabs from "@/components/Tabs/Tabs.tsx";
import Button from "@/components/Button/Button.tsx";
import { FormEvent, ReactNode, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { CloseIcon, FilterIcon } from "@/assets/icons/shared.vectors.tsx";
import { ThemeContext } from "@/contexts/ThemeContext.tsx";

const Filter = ({
  tabs,
  activeTabs,
  buttons,
  children,
  onFilter,
  onClear,
}: {
  tabs?: any[] | null;
  activeTabs?: number;
  buttons?: any[];
  children?: ReactNode;
  onFilter?: () => void;
  onClear?: () => void;
}) => {
  const { t } = useTranslation();
  const { darkMode } = useContext(ThemeContext);
  const [filter, setFilter] = useState<boolean>(false);

  return (
    <>
      <div className={`${styles.filter} ${darkMode && styles.dark}`}>
        <div className={styles.filter__button}>
          <Button
            text={t("shared.buttons.filter")}
            icon={FilterIcon}
            onClick={() => {
              setFilter(!filter);
            }}
          />

          {buttons &&
            buttons?.map((button, index) => (
              <Button
                key={index}
                text={t(button.title)}
                onClick={button.onClick}
              />
            ))}
        </div>

        {tabs && (
          <div className={styles.filter__tabs}>
            <Tabs tabs={tabs} active={activeTabs} />
          </div>
        )}
      </div>

      <div
        className={`${styles.filter__box} ${filter && styles.active} ${darkMode && styles.dark}`}
      >
        <div className={styles.filter__box__content}>
          <div className={styles.filter__box__content__info}>
            <p>Filters</p>
            <button
              onClick={() => {
                setFilter(!filter);
              }}
            >
              <CloseIcon />
            </button>
          </div>

          <form
            onSubmit={(event: FormEvent) => {
              event.preventDefault();

              if (onFilter) onFilter();
              setFilter(!filter);
            }}
          >
            {children && children}

            <div className={styles.filter__box__content__buttons}>
              <Button text={"Filterle"} type={"submit"} />
              <Button
                text={"Sifirla"}
                viewType={"dark-green"}
                onClick={() => {
                  if (onClear) onClear();
                  setFilter(!filter);
                }}
                type={"button"}
              />
            </div>
          </form>
        </div>
        <div
          onClick={() => {
            setFilter(!filter);
          }}
          className={styles.filter__box__overlay}
        ></div>
      </div>
    </>
  );
};

export default Filter;
