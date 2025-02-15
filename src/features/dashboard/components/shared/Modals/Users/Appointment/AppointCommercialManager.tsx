import styles from "@/components/Modal/Modal.module.scss";
import SelectOption from "@/components/New/SelectOption/SelectOption.tsx";
import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { formCreator } from "@/libs/form.ts";
import { toast } from "react-toastify";
import { errorMessageHandler } from "@/libs/error.ts";
import { useTranslation } from "react-i18next";
import { postAppointCommercialManagerRequest } from "@/features/dashboard/services/user.service.ts";
import { getAllCommercialManagerRequest } from "@/features/dashboard/services/workers.service.ts";

const AppointCommercialManager = ({
  userId,
  modalClose,
}: {
  userId: number;
  modalClose: (isRender: boolean) => void;
}) => {
  // Reacts
  const { t } = useTranslation();

  // Contexts
  const { setLoader } = useContext(LoaderContext);

  // States
  const [managers, setManagers] = useState<{ name: string; value: number }[]>(
    [],
  );

  // Refs
  const inputsRef = {
    commercial_manager: useRef<HTMLInputElement>(null),
  };

  // Functions
  const appointCommercialManager = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const formData = formCreator([
      {
        name: "user_id",
        data: userId,
      },
      {
        name: "manager_id",
        data: inputsRef.commercial_manager.current?.value,
      },
    ]);
    const { status, data } =
      await postAppointCommercialManagerRequest(formData);
    if (status === 200) {
      modalClose(true);
      toast.success(errorMessageHandler(data));
    } else toast.error(errorMessageHandler(data));

    setLoader(false);
  };

  const getAllManager = async () => {
    setLoader(true);
    const { status, data } = await getAllCommercialManagerRequest();
    if (status === 200) {
      setManagers(data);
      toast.success(errorMessageHandler(data));
    } else toast.error(errorMessageHandler(data));
    setLoader(false);
  };

  // useEffects
  useEffect(() => {
    getAllManager().catch(() => {});
  }, []);

  return (
    <Modal
      title={t("users.modals.appoint_commercial_manager.title")}
      subtitle={t("users.modals.appoint_commercial_manager.subtitle")}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={appointCommercialManager}>
        <div className={styles.form__inputs}>
          <SelectOption
            label={t("users.modals.appoint_commercial_manager.inputs.selected")}
            inputRef={inputsRef.commercial_manager}
            options={managers}
            // isSearchable
            // isSearch={(searchValue) => {
            //   setManagers(
            //     managers.filter((manager) =>
            //       manager.name
            //         .toLowerCase()
            //         .includes(searchValue.toLowerCase()),
            //     ),
            //   );
            // }}
            required
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

export default AppointCommercialManager;
