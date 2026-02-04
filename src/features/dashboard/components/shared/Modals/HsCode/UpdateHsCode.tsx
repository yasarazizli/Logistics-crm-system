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
import { HsCodeUpdateRequest } from "@/features/dashboard/services/Controls/hscode.service.ts";

interface HsCode {
  cargo: string;
  code: string;
  description: string;
}

const UpdateHsCode = ({
  modalClose,
  id,
  value,
}: {
  modalClose: (isRender: boolean) => void;
  id: number;
  value: HsCode;
}) => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();

  const inputsRef = {
    cargo: useRef<HTMLInputElement>(null),
    code: useRef<HTMLInputElement>(null),
    description: useRef<HTMLInputElement>(null),
  };

  const update = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const formData = formCreator([
      {
        name: "cargo",
        data: inputsRef.cargo.current?.value,
      },
      {
        name: "code",
        data: inputsRef.code.current?.value,
      },
      {
        name: "description",
        data: inputsRef.description.current?.value,
      },
    ]);
    const { status, data } = await HsCodeUpdateRequest(formData, id);
    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));
    setLoader(false);
    modalClose(true);
  };

  return (
    <Modal
      title={t("workers.modals.create.update")}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={update}>
        <div className={styles.form__inputs}>
          <Input
            type="text"
            label={t("workers.modals.create.inputs.full_name.label")}
            placeholder={t(
              "workers.modals.create.inputs.full_name.placeholder",
            )}
            inputRef={inputsRef.cargo}
            autoComplete="none"
            required
            value={value?.cargo}
          />
          <Input
            type="text"
            label={t("workers.modals.create.inputs.hs__code.label")}
            placeholder={t("workers.modals.create.inputs.hs__code.placeholder")}
            inputRef={inputsRef.code}
            autoComplete="none"
            required
            value={value?.code}
          />
          <Input
            type="text"
            label={t("workers.modals.create.inputs.description.label")}
            placeholder={t(
              "workers.modals.create.inputs.description.placeholder",
            )}
            inputRef={inputsRef.description}
            autoComplete="none"
            required
            value={value?.description}
          />
        </div>

        <div className={styles.form__buttons}>
          <Button
            text={t("shared.buttons.cancel")}
            viewType="red"
            type={"button"}
            onClick={() => modalClose(false)}
          />
          <Button text={t("shared.buttons.save")} type={"submit"} />
        </div>
      </form>
    </Modal>
  );
};

export default UpdateHsCode;
