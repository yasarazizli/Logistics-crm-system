import { TextareaHTMLAttributes, useContext } from "react";
import styles from "./TextArea.module.scss";
import { ThemeContext } from "@/contexts/ThemeContext.tsx";

type TextAreaProps = {
  label?: string;
  inputRef?: any;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextArea = ({ label, inputRef, ...props }: TextAreaProps) => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`${styles.textarea} ${darkMode && styles.dark}`}>
      {label && <p className={styles.label}>{label}</p>}
      <textarea {...props} ref={inputRef} />
    </div>
  );
};

export default TextArea;
