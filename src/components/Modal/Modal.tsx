import React, { useContext } from "react";
import styles from "@/components/Modal/Modal.module.scss";
import { ThemeContext } from "@/contexts/ThemeContext.tsx";

const Modal = ({
  title,
  subtitle,
  modalClose,
  children,
}: {
  title?: string;
  subtitle?: string;
  modalClose: () => void;
  children?: React.ReactNode;
}) => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`${styles.modal} ${darkMode && styles.dark}`}>
      <div onClick={modalClose} className={styles.modal__outer}></div>
      <div className={styles.modal__inner}>
        <div className={styles.head}>
          {title && <p className={styles.title}>{title}</p>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        <>{children}</>
      </div>
    </div>
  );
};

export default Modal;
