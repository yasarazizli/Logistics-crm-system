import styles from "@/components/Modal/Modal.module.scss";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import { UserModel } from "@/features/dashboard/models/dashboard.model.ts";
import { useTranslation } from "react-i18next";
import { FormEvent, useContext } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { deleteAdminUserRequest } from "@/features/dashboard/services/user.service.ts";
import { errorMessageHandler } from "@/libs/error.ts";
import { toast } from "react-toastify";

const UserDelete = ({
  user,
  modalClose,
}: {
  user: UserModel;
  modalClose: (isRender: boolean) => void;
}) => {
  const { t } = useTranslation();
  const { setLoader } = useContext(LoaderContext);

  const adminDeleteUser = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);
    const { status, data } = await deleteAdminUserRequest(Number(user.id));

    if (status == 200) {
      modalClose(true);
      toast.success(errorMessageHandler(data));
    } else toast.error(errorMessageHandler(data));

    setLoader(false);
  };

  return (
    <Modal
      title={t("users.modals.delete_user.title")}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={adminDeleteUser}>
        <div className={styles.form__inputs}>
          <p
            className={styles.form__inputs__text}
          >{`${user?.full_name} ${t("users.modals.delete_user.subtitle")}`}</p>
        </div>
        <div className={styles.form__buttons}>
          <Button
            type={"button"}
            text={t("vendors.modals.contract_delete.buttons.reject")}
            viewType={"dark-green"}
            onClick={() => modalClose(false)}
          />
          <Button
            type={"submit"}
            text={t("vendors.modals.contract_delete.buttons.approve")}
          />
        </div>
      </form>
    </Modal>
  );
};

export default UserDelete;
