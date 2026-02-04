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
import {
  CountryFinder,
  StationUpdateRequest,
} from "@/features/dashboard/services/Controls/station.service.ts";
import Select, { StylesConfig } from "react-select";

interface OptionType {
  value: number;
  label: string;
}

interface Country {
  id: number;
  name: string;
}

interface Station {
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  pole: string;
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

const UpdateStation = ({
  modalClose,
  id,
  station,
}: {
  modalClose: (isRender: boolean) => void;
  id: number;
  station: Station;
}) => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();
  const [countries, setCountries] = useState<OptionType[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<OptionType | null>(
    null,
  );

  const [inputValues, setInputValues] = useState({
    name: station?.name || "",
    code: station?.code || "",
    latitude: station?.latitude?.toString() || "",
    longitude: station?.longitude?.toString() || "",
    pole: station?.pole || "",
  });

  const inputsRef = {
    name: useRef<HTMLInputElement>(null),
    code: useRef<HTMLInputElement>(null),
    latitude: useRef<HTMLInputElement>(null),
    longitude: useRef<HTMLInputElement>(null),
    pole: useRef<HTMLInputElement>(null),
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

  const handleInputChange = (field: string, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const update = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const formData = formCreator([
      { name: "name", data: inputValues.name },
      { name: "code", data: inputValues.code },
      { name: "latitude", data: inputValues.latitude },
      { name: "longitude", data: inputValues.longitude },
      { name: "pole", data: inputValues.pole },
      { name: "country_id", data: selectedCountry?.value },
    ]);

    const { status, data } = await StationUpdateRequest(formData, id);
    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));

    setLoader(false);
    modalClose(true);
  };

  return (
    <Modal
      title={t("workers.modals.create.update__2")}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={update}>
        <div className={styles.form__inputs}>
          <Input
            type="text"
            label={t("workers.modals.create.inputs.full_name.label__2")}
            placeholder={t(
              "workers.modals.create.inputs.full_name.placeholder",
            )}
            inputRef={inputsRef.name}
            autoComplete="none"
            required
            defaultValue={station?.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
          <Input
            type="text"
            label={t("workers.modals.create.inputs.hs__code.label__1")}
            placeholder={t("workers.modals.create.inputs.hs__code.placeholder")}
            inputRef={inputsRef.code}
            autoComplete="none"
            required
            defaultValue={station?.code}
            onChange={(e) => handleInputChange("code", e.target.value)}
          />
          <Input
            type="text"
            label={t("workers.modals.create.inputs.description.label__1")}
            placeholder={t(
              "workers.modals.create.inputs.description.placeholder__1",
            )}
            inputRef={inputsRef.latitude}
            autoComplete="none"
            required
            defaultValue={station?.latitude?.toString()}
            onChange={(e) => handleInputChange("latitude", e.target.value)}
          />
          <Input
            type="text"
            label={t("workers.modals.create.inputs.description.label__2")}
            placeholder={t(
              "workers.modals.create.inputs.description.placeholder__1",
            )}
            inputRef={inputsRef.longitude}
            autoComplete="none"
            required
            defaultValue={station?.longitude?.toString()}
            onChange={(e) => handleInputChange("longitude", e.target.value)}
          />
          <Input
            type="text"
            label={t("workers.modals.create.inputs.description.label__3")}
            placeholder={t(
              "workers.modals.create.inputs.description.placeholder__1",
            )}
            inputRef={inputsRef.pole}
            autoComplete="none"
            required
            defaultValue={station?.pole}
            onChange={(e) => handleInputChange("pole", e.target.value)}
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

export default UpdateStation;
