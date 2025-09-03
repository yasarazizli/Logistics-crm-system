import styles from "@/components/Modal/Modal.module.scss";
import Input from "@/components/Input/Input.tsx";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import { FormEvent, useContext, useRef } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { formCreator } from "@/libs/form.ts";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { errorMessageHandler } from "@/libs/error.ts";
import { CountryUpdateRequest } from "@/features/dashboard/services/Controls/country.service.ts";

interface Country {
  name: string;
}

const UpdateDate = ({
  modalClose,
  id,
  country,
}: {
  modalClose: (isRender: boolean) => void;
  id: number;
  country: Country;
}) => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();

  const inputsRef = {
    name: useRef<HTMLInputElement>(null),
  };

  const update = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const formData = formCreator([
      {
        name: "name",
        data: inputsRef.name.current?.value,
      },
    ]);
    const { status, data } = await CountryUpdateRequest(formData, id);
    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));
    setLoader(false);
    modalClose(true);
  };

  return (
    <Modal
      title={t("workers.modals.create.update__1")}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={update}>
        <div className={styles.form__inputs}>
          <Input
            type="text"
            label={t("workers.modals.create.inputs.full_name.label__1")}
            placeholder={t(
              "workers.modals.create.inputs.full_name.placeholder",
            )}
            inputRef={inputsRef.name}
            autoComplete="none"
            required
            value={country?.name}
          />
        </div>

        <div className={styles.form__buttons}>
          <Button
            text={t("shared.buttons.cancel")}
            type={"button"}
            onClick={() => modalClose(false)}
          />
          <Button text={t("shared.buttons.save")} type={"submit"} />
        </div>
      </form>
    </Modal>
  );
};

export default UpdateDate;
