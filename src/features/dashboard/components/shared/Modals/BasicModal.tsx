import Modal from "@/components/Modal/Modal.tsx";
import styles from "@/components/Modal/Modal.module.scss";
import Button from "@/components/Button/Button.tsx";

const BasicModal = ({
  title,
  doneTitle,
  doneClick,
  closeTitle,
  modalClose,
}: {
  title: string;
  doneTitle: string;
  doneClick: () => void;
  closeTitle: string;
  modalClose: () => void;
}) => {
  return (
    <Modal title={title} modalClose={modalClose}>
      <div className={styles.form}>
        <p>Salam Contractdi Deaktiv Etmeye Eminsiniz?</p>
        <div className={styles.form__buttons}>
          <Button
            text={closeTitle}
            onClick={modalClose}
            viewType={"dark-green"}
          />
          <Button text={doneTitle} onClick={doneClick} />
        </div>
      </div>
    </Modal>
  );
};
export default BasicModal;
