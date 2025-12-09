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
import { addCreditLimit } from "@/features/dashboard/services/Accountant/accountant.service.ts";

const CreditLimit = ({
  modalClose,
  id,
}: {
  modalClose: (isRender: boolean) => void;
  id: number;
}) => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();

  const inputsRef = {
    limit: useRef<HTMLInputElement>(null),
  };

  const create = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const formData = formCreator([
      { name: "limit", data: inputsRef.limit.current?.value },
    ]);

    const { status, data } = await addCreditLimit(formData, id);
    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));

    setLoader(false);
    modalClose(true);
  };

  return (
    <Modal title={"Add Credit Limit"} modalClose={() => modalClose(false)}>
      <form className={styles.form} onSubmit={create}>
        <div className={styles.form__inputs}>
          <Input
            type="number"
            label={"Credit Limit"}
            placeholder={"Credit Limit"}
            inputRef={inputsRef.limit}
            autoComplete="off"
            required
          />
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

export default CreditLimit;
