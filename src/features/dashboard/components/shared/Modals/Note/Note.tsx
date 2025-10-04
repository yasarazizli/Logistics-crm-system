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
import { addBalanceServices } from "@/features/dashboard/services/Users/addbalance.service.ts";

const Note = ({ modalClose }: { modalClose: (isRender: boolean) => void }) => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();

  const inputsRef = {
    note: useRef<HTMLInputElement>(null),
  };

  const create = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const formData = formCreator([
      {
        name: "note",
        data: inputsRef.note.current?.value,
      },
    ]);

    const { status, data } = await addBalanceServices(formData);
    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));
    setLoader(false);
    modalClose(true);
  };

  return (
    <Modal title="Send Note" modalClose={() => modalClose(false)}>
      <form className={styles.form} onSubmit={create}>
        <div className={styles.form__inputs}>
          <Input
            type="text"
            label="Note"
            placeholder="Note"
            inputRef={inputsRef.note}
            autoComplete="none"
            required
            style={{ width: "600px" }}
          />
        </div>

        <div className={styles.form__buttons}>
          <Button
            text={t("shared.buttons.cancel")}
            type={"button"}
            onClick={() => modalClose(false)}
          />
          <Button text="Send" type={"submit"} />
        </div>
      </form>
    </Modal>
  );
};

export default Note;
