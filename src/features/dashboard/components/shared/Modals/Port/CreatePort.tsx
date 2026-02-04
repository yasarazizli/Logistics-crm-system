import styles from "@/components/Modal/Modal.module.scss";
import Input from "@/components/Input/Input.tsx";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { formCreator } from "@/libs/form.ts";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { errorMessageHandler } from "@/libs/error.ts";
import { CountryFinder } from "@/features/dashboard/services/Controls/station.service.ts";
import { PortCreateRequest } from "@/features/dashboard/services/Controls/port.service.ts";
import Select, { StylesConfig } from "react-select";

interface OptionType {
  value: number;
  label: string;
}

interface Country {
  id: number;
  name: string;
}

const customStyles: StylesConfig<OptionType, false> = {
  control: (provided) => ({
    ...provided,
    borderRadius: 6,
    border: "1px solid #E7E7E7",
    backgroundColor: "#F5F5F5",
    height: "53px",
    fontFamily: "Manrope",
    fontSize: "14px",
    fontWeight: 500,
    boxShadow: "none",
    color: "#7b7979",
    "&:hover": {
      border: "1px solid #E7E7E7",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "10px 10px",
    overflow: "visible",
  }),
  input: (provided) => ({
    ...provided,
    margin: 0,
    padding: 0,
    color: "#000",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#000",
    overflow: "visible",
  }),
  placeholder: (provided) => ({ ...provided, color: "rgba(0,0,0,0.48)" }),
  clearIndicator: (provided) => ({
    ...provided,
    cursor: "pointer",
    color: "#000000",
    ":hover": {
      color: "#000",
    },
  }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: () => ({ display: "none" }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  option: (provided, state) => ({
    ...provided,
    fontFamily: "Manrope",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    backgroundColor: state.isSelected
      ? "#1D736B"
      : state.isFocused
        ? "#beeabe"
        : "white",
    color: state.isSelected ? "white" : "#000",
    ":active": {
      backgroundColor: "#1D736B",
      color: "white",
    },
  }),
};

const CreatePort = ({
  modalClose,
}: {
  modalClose: (isRender: boolean) => void;
}) => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();
  const [countries, setCountries] = useState<OptionType[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<OptionType | null>(
    null,
  );

  const inputsRef = {
    name: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    const fetchCountries = async () => {
      const res = await CountryFinder("", 1, 999);
      if (res?.status === 200 && res.data?.data) {
        const mappedCountries = res.data.data.map((country: Country) => ({
          value: country.id,
          label: country.name,
        }));
        setCountries(mappedCountries);
      }
    };
    fetchCountries();
  }, []);

  const create = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const formData = formCreator([
      { name: "name", data: inputsRef.name.current?.value },
      { name: "country_id", data: selectedCountry?.value },
    ]);

    const { status, data } = await PortCreateRequest(formData);
    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));

    setLoader(false);
    modalClose(true);
  };

  return (
    <Modal
      title={t("workers.modals.create.add")}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={create}>
        <div className={styles.form__inputs}>
          <Input
            type="text"
            label={t("workers.modals.create.inputs.full_name.label__port")}
            placeholder={t(
              "workers.modals.create.inputs.full_name.placeholder",
            )}
            inputRef={inputsRef.name}
            autoComplete="none"
            required
          />
          <div className={styles.selectWrapper}>
            <label className={styles.label}>
              {t("workers.modals.create.inputs.description.label__4")}
            </label>
            <Select
              options={countries}
              value={selectedCountry}
              onChange={setSelectedCountry}
              styles={customStyles}
              placeholder={t(
                "workers.modals.create.inputs.description.label__4",
              )}
              isSearchable
              required
              isClearable
              menuPortalTarget={document.body}
              menuPosition="fixed"
              menuShouldScrollIntoView={false}
            />
          </div>
        </div>

        <div className={styles.form__buttons}>
          <Button
            text={t("shared.buttons.cancel")}
            viewType="red"
            type="button"
            onClick={() => modalClose(false)}
          />
          <Button text={t("shared.buttons.save")} type="submit" />
        </div>
      </form>
    </Modal>
  );
};

export default CreatePort;
