import styles from "@/components/Modal/Modal.module.scss";
import Modal from "@/components/Modal/Modal.tsx";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

interface BlockedProps {
  modalClose: () => void;
}

const Blocked = ({ modalClose }: BlockedProps) => {
  const { t } = useTranslation();
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    btnRef.current?.focus();
  }, []);

  return (
    <Modal title={t("Account blocked")} modalClose={modalClose}>
      <div className={styles.form}>
        <div className={styles.form__inputs}>
          <p className={styles.blocked__head}>
            Your account has been deactivated.
          </p>
          <p className={styles.blocked__title}>
            To reactivate, contact your manager or{" "}
            <a
              href="mailto:support@yourcompany.com"
              style={{ color: "#2563eb", fontWeight: 500 }}
            >
              support@yourcompany.com
            </a>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default Blocked;
