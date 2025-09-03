import { CSSProperties, InputHTMLAttributes } from "react";
import styles from "./Input.module.scss";

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
  return (
    <label
      className={`${styles.input} ${props.type === "file" && styles.file} ${props.disabled && styles.disabled}`}
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
