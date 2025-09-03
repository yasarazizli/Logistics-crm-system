import React from "react";
import styles from "./Button.module.scss";

type Props = {
  text: string;
  onClick?: () => void;
  viewType?: "dark__blue" | "red" | "green__light" | "dark-green";
  icon?: React.ElementType;
  type?: "button" | "submit";
};

const Button: React.FC<Props> = ({
  text,
  onClick,
  viewType = "",
  icon: Icon,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${viewType && styles[viewType]}`}
    >
      {Icon && (
        <span className={styles.icon}>
          <Icon />
        </span>
      )}
      <span>{text}</span>
    </button>
  );
};

export default Button;
