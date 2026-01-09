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
import { PortUpdateRequest } from "@/features/dashboard/services/Controls/port.service.ts";

interface Country {
  id: number;
  name: string;
}

interface Port {
  name: string;
}

const UpdatePort = ({
  modalClose,
  id,
  port,
}: {
  modalClose: (isRender: boolean) => void;
  id: number;
  port: Port;
}) => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  const inputsRef = {
    name: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    const fetchCountries = async () => {
      const res = await CountryFinder("", 1, 999);
      if (res?.status === 200 && res.data?.data) {
        setCountries(res.data?.data);
      }
    };
    fetchCountries();
  }, []);

  const update = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const formData = formCreator([
      { name: "name", data: inputsRef.name.current?.value },
      { name: "country_id", data: selectedCountry },
    ]);

    const { status, data } = await PortUpdateRequest(formData, id);
    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));

    setLoader(false);
    modalClose(true);
  };

  return (
    <Modal
      title={t("workers.modals.create.update__port")}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={update}>
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
            value={port?.name}
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

export default UpdatePort;
