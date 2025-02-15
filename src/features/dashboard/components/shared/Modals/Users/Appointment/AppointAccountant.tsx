import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import SelectOption from "@/components/New/SelectOption/SelectOption.tsx";
import styles from "@/components/Modal/Modal.module.scss";
import { formCreator } from "@/libs/form.ts";
import { toast } from "react-toastify";
import { errorMessageHandler } from "@/libs/error.ts";
import { useTranslation } from "react-i18next";
import { getAllAccountantRequest } from "@/features/dashboard/services/workers.service.ts";
import { postAssignAccountantToUserRequest } from "@/features/dashboard/services/user.service.ts";

const AppointAccountant = ({
  modalClose,
  userId,
}: {
  modalClose: (isRender: boolean) => void;
  userId: number;
}) => {
  const { t } = useTranslation();
  const { setLoader } = useContext(LoaderContext);

  const [response, setResponse] = useState([]);

  const inputsRef = {
    accountant: useRef<HTMLInputElement>(null),
  };

  const appointAccountant = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);
    const formData = formCreator([
      {
        name: "accountant_id",
        data: inputsRef.accountant.current?.value,
      },
      {
        name: "user_id",
        data: userId,
      },
    ]);
    const { status, data } = await postAssignAccountantToUserRequest(formData);
    if (status === 200) {
      modalClose(true);
      toast.success(errorMessageHandler(data));
    } else toast.error(errorMessageHandler(data));
    setLoader(false);
  };

  const getAllAccountant = async () => {
    setLoader(true);
    const { status, data } = await getAllAccountantRequest();
    if (status === 200) setResponse(data);
    setLoader(false);
  };

  useEffect(() => {
    getAllAccountant().catch(() => {});
  }, []);

  return (
    <Modal
      title={t("users.modals.appoint_accountant.title")}
      subtitle={t("users.modals.appoint_accountant.subtitle")}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={appointAccountant}>
        <div className={styles.form__inputs}>
          <SelectOption
            label={t("users.modals.appoint_accountant.inputs.selected")}
            required
            options={response}
            inputRef={inputsRef.accountant}
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

export default AppointAccountant;
