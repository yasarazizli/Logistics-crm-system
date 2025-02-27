import Modal from "@/components/Modal/Modal.tsx";
import styles from "@/components/Modal/Modal.module.scss";
import Button from "@/components/Button/Button.tsx";
import { FormEvent, useContext, useRef } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import {
  clearReferenceInputValues,
  formCreator,
  onlyNumberInputValues,
} from "@/libs/form.ts";
import { toast } from "react-toastify";
import Input from "@/components/Input/Input.tsx";
import { useTranslation } from "react-i18next";
import { errorMessageHandler } from "@/libs/error.ts";
import { OrdersModel } from "@/features/dashboard/models/order.model.ts";
import { postOrderPaymentRequest } from "@/features/dashboard/services/order.service.ts";

const OrderPayment = ({
  modalClose,
  order,
}: {
  modalClose: (isRender: boolean) => void;
  order: OrdersModel;
}) => {
  const { t } = useTranslation();
  const { setLoader } = useContext(LoaderContext);
  const inputsRef = {
    file: useRef<HTMLInputElement | null>(null),
    balance: useRef<HTMLInputElement | null>(null),
  };

  const addUserBalance = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);
    const formData = formCreator([
      {
        name: "amount",
        data: inputsRef.balance.current?.value || "",
      },
      {
        name: "file",
        data: inputsRef.file.current?.files?.[0],
      },
    ]);
    console.log(order);
    const { status, data } = await postOrderPaymentRequest(formData, order.id);
    if (status === 200) {
      modalClose(true);
      clearReferenceInputValues(inputsRef);
      toast.success(errorMessageHandler(data));
    } else toast.error(errorMessageHandler(data));
    setLoader(false);
  };

  return (
    <Modal
      title={"Sifarishin Qiymeti"}
      subtitle={"Sifarishin qiymeti descraption"}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={addUserBalance}>
        <div className={styles.form__inputs}>
          <Input
            label={t("users.modals.add_balance.inputs.amount")}
            maxLength={10}
            required
            inputRef={inputsRef.balance}
            onChange={(event) => {
              onlyNumberInputValues(event);
            }}
          />
        </div>

        <div className={styles.form__buttons}>
          <Button
            text={t("shared.buttons.cancel")}
            viewType={"dark-green"}
            onClick={() => modalClose(false)}
            type={"button"}
          />

          <Button text={t("shared.buttons.save")} type={"submit"} />
        </div>
      </form>
    </Modal>
  );
};

export default OrderPayment;
