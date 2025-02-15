import { ButtonHTMLAttributes, CSSProperties } from "react";
import styles from "./Button.module.scss";

type ButtonProps = {
  text: string;
  icon?: any;
  textStyle?: CSSProperties;
  viewType?: "dark-green" | "red";
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  text,
  textStyle,
  icon: Icon,
  viewType,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`${styles.button} ${viewType === "dark-green" && styles.dark__blue} ${viewType === "red" && styles.red}`}
      {...props}
    >
      {Icon && <Icon />}
      <span style={textStyle}>{text}</span>
    </button>
  );
};

export default Button;
