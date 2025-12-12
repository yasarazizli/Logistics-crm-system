import { CSSProperties, InputHTMLAttributes } from "react";
import styles from "./Input.module.scss";

type InputProps = {
  label?: string;
  red?: string;
  icon?: any;
  inputRef?: any;
  textStyle?: CSSProperties;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = ({
  label,
  icon: Icon,
  inputRef,
  textStyle,
  red,
  ...props
}: InputProps) => {
  return (
    <div
      className={`${styles.input} ${props.type === "file" && styles.file} ${props.disabled && styles.disabled}`}
    >
      <div className={styles.red}>
        {label && <span style={textStyle}>{label}</span>}
        {red && <div style={{ color: "red", paddingTop: "6px" }}>{red}</div>}
      </div>
      <div className={`${styles.input__box} ${!Icon && styles.without__icon}`}>
        {Icon && (
          <div className={styles.icon}>
            <Icon />
          </div>
        )}
        <input ref={inputRef} {...props} />
      </div>
    </div>
  );
};

export default Input;
