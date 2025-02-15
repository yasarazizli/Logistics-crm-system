import { CSSProperties, InputHTMLAttributes, useContext } from "react";
import styles from "./Input.module.scss";
import { ThemeContext } from "@/contexts/ThemeContext.tsx";

type InputProps = {
  label?: string;
  icon?: any;
  inputRef?: any;
  textStyle?: CSSProperties;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = ({
  label,
  icon: Icon,
  inputRef,
  textStyle,
  ...props
}: InputProps) => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <label
      className={`${styles.input} ${props.type === "file" && styles.file} ${props.disabled && styles.disabled} ${darkMode && styles.dark}`}
    >
      {label && <span style={textStyle}>{label}</span>}
      <div className={`${styles.input__box} ${!Icon && styles.without__icon}`}>
        {Icon && (
          <div className={styles.icon}>
            <Icon />
          </div>
        )}
        <input ref={inputRef} {...props} />
      </div>
    </label>
  );
};

export default Input;
