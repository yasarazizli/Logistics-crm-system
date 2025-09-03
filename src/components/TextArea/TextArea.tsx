import { TextareaHTMLAttributes } from "react";
import styles from "./TextArea.module.scss";

type TextAreaProps = {
  label?: string;
  inputRef?: any;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextArea = ({ label, inputRef, ...props }: TextAreaProps) => {
  return (
    <div className={styles.textarea}>
      {label && <p className={styles.label}>{label}</p>}
      <textarea {...props} ref={inputRef} />
    </div>
  );
};

export default TextArea;
