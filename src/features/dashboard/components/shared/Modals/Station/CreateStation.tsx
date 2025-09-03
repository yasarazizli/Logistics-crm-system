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
  StationCreateRequest,
} from "@/features/dashboard/services/Controls/station.service.ts";

interface Country {
  id: number;
  name: string;
}

const CreateStation = ({
  modalClose,
}: {
  modalClose: (isRender: boolean) => void;
}) => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  const inputsRef = {
    name: useRef<HTMLInputElement>(null),
    code: useRef<HTMLInputElement>(null),
    latitude: useRef<HTMLInputElement>(null),
    longitude: useRef<HTMLInputElement>(null),
    pole: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    const fetchCountries = async () => {
      const res = await CountryFinder("");
      if (res?.status === 200 && res.data?.data) {
        setCountries(res.data?.data);
      }
    };
    fetchCountries();
  }, []);

  const create = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const formData = formCreator([
      { name: "name", data: inputsRef.name.current?.value },
      { name: "code", data: inputsRef.code.current?.value },
      { name: "latitude", data: inputsRef.latitude.current?.value },
      { name: "longitude", data: inputsRef.longitude.current?.value },
      { name: "pole", data: inputsRef.pole.current?.value },
      { name: "country_id", data: selectedCountry },
    ]);

    const { status, data } = await StationCreateRequest(formData);
    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));

    setLoader(false);
    modalClose(true);
  };

  return (
    <Modal
      title={t("workers.modals.create.title__2")}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={create}>
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
          />
          <Input
            type="text"
            label={t("workers.modals.create.inputs.hs__code.label__1")}
            placeholder={t("workers.modals.create.inputs.hs__code.placeholder")}
            inputRef={inputsRef.code}
            autoComplete="none"
            required
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
          />

          <div className={styles.selectWrapper}>
            <label className={styles.label}>
              {t("workers.modals.create.inputs.description.label__4")}
            </label>
            <select
              className={styles.select}
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              required
            >
              <option value="">
                {t("workers.modals.create.inputs.description.label__4")}
              </option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.form__buttons}>
          <Button
            text={t("shared.buttons.cancel")}
            type="button"
            onClick={() => modalClose(false)}
          />
          <Button text={t("shared.buttons.save")} type="submit" />
        </div>
      </form>
    </Modal>
  );
};

export default CreateStation;
