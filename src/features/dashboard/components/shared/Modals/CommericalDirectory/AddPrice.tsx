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
import { putSellingPrice } from "@/features/dashboard/services/CommercialDirectory/commercial.services.ts";

const AddPrice = ({
  modalClose,
  id,
}: {
  modalClose: (isRender: boolean) => void;
  id: number;
}) => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();

  const inputsRef = {
    selling_price_ton: useRef<HTMLInputElement>(null),
    selling_price_unit: useRef<HTMLInputElement>(null),
  };

  const create = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const formData = formCreator([
      {
        name: "selling_price_ton",
        data: inputsRef.selling_price_ton.current?.value,
      },
      {
        name: "selling_price_unit",
        data: inputsRef.selling_price_unit.current?.value,
      },
    ]);

    const { status, data } = await putSellingPrice(formData, id);
    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));
    setLoader(false);
    modalClose(true);
  };

  return (
    <Modal title={t("cd.modal.price")} modalClose={() => modalClose(false)}>
      <form className={styles.form} onSubmit={create}>
        <div className={styles.form__inputs}>
          <Input
            type="text"
            label={t("cd.modal.input_1")}
            placeholder={t("cd.modal.placeholder")}
            inputRef={inputsRef.selling_price_ton}
            autoComplete="none"
            required
          />
          <Input
            type="text"
            label={t("cd.modal.input_2")}
            placeholder={t("cd.modal.placeholder")}
            inputRef={inputsRef.selling_price_unit}
            autoComplete="none"
            required
          />
        </div>

        <div className={styles.form__buttons}>
          <Button
            text={t("shared.buttons.cancel")}
            type={"button"}
            viewType="red"
            onClick={() => modalClose(false)}
          />
          <Button text={t("shared.buttons.save")} type={"submit"} />
        </div>
      </form>
    </Modal>
  );
};

export default AddPrice;
