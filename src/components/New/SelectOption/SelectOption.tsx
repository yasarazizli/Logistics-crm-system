import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./SelectOption.module.scss";
import { ThemeContext } from "@/contexts/ThemeContext.tsx";
import { SelectOptionsArrowIcon } from "@/assets/icons/shared.vectors.tsx";
import useClickOutside from "@/hooks/useClickOutside.ts";
import { useTranslation } from "react-i18next";

type Option = {
  name: string;
  value?: string | number;
};

type SelectOptionProps = {
  label: string;
  options: Option[];
  inputRef?: React.RefObject<HTMLInputElement>;
  onChange?: (options: Option) => void;
  value?: Option;
  disabled?: boolean;
  required?: boolean;
  isSearchable?: boolean;
  isSearch?: (searchValue: string) => void;
};

const SelectOption = ({
  options,
  label,
  required,
  inputRef,
  onChange,
  value,
  disabled,
  isSearchable,
  isSearch,
}: SelectOptionProps) => {
  // Contexts
  const { darkMode } = useContext(ThemeContext);
  const { t } = useTranslation();

  // Refs
  const boxRef = useRef<HTMLDivElement>(null);
  const clickedInside = useClickOutside(boxRef);

  // States
  const [selectedValue, setSelectedValue] = useState<Option | null>(null);
  const [open, setOpen] = useState(false);

  // useEffects
  useEffect(() => {
    if (value) setSelectedValue(value);
  }, []);

  useEffect(() => {
    if (!clickedInside) setOpen(false);
  }, [clickedInside]);

  return (
    <div className={`${styles.select__box} ${darkMode && styles.dark}`}>
      {/* Label */}
      {label && <p>{label}</p>}

      {/* Selections */}
      <div
        onClick={() => {
          setOpen((prev) => !prev);
          if (isSearch) {
            isSearch("");
          }
        }}
        className={`${styles.select} ${disabled && styles.disabled}`}
      >
        {/* PlaceHolder */}
        <div className={styles.select__placeholder}>
          <span>
            {selectedValue?.name
              ? t(selectedValue.name)
              : t("shared.inputs.selected.default")}
          </span>
          <SelectOptionsArrowIcon />
        </div>

        {/* Options */}
        {open && (
          <div ref={boxRef} className={styles.select__content}>
            {isSearchable && (
              <div
                key={`option_search`}
                className={styles.select__content__item}
                onClick={(event) => event.stopPropagation()}
              >
                <input
                  type={"text"}
                  placeholder={t("shared.buttons.search")}
                  onChange={(event) => {
                    if (isSearch) {
                      isSearch(event.target.value);
                    }
                  }}
                />
              </div>
            )}

            <div
              key={`option_first`}
              className={styles.select__content__item}
              onClick={() => {
                if (onChange) {
                  onChange({
                    name: "null",
                    value: "null",
                  });
                }
                setSelectedValue(null);
              }}
            >
              {t("shared.inputs.selected.default")}
            </div>

            {options?.map((option, index) => (
              <div
                key={`option_${index}`}
                className={styles.select__content__item}
                onClick={() => {
                  if (option?.value !== selectedValue?.value) {
                    if (onChange) {
                      onChange(option);
                    }
                    setSelectedValue(option);
                  }
                }}
              >
                <span>{t(option.name)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Input */}
        <input
          type="text"
          required={required}
          defaultValue={value ? value.value : selectedValue?.value}
          name={label}
          ref={inputRef}
          className={styles.select__input}
        />
      </div>
    </div>
  );
};

export default SelectOption;
