import { CSSProperties, SelectHTMLAttributes } from "react";
import styles from "./SelectOption.module.scss";

type Option = {
  name: string;
  value?: string | number;
};

type SelectOptionProps = {
  label?: string;
  options?: Option[];
  inputRef?: any;
  textStyle?: CSSProperties;
} & SelectHTMLAttributes<HTMLSelectElement>;

const SelectOption = ({
  label,
  options,
  inputRef,
  textStyle,
  ...props
}: SelectOptionProps) => {
  return (
    <div className={styles.select__box}>
      {label && <p style={textStyle}>{label}</p>}
      <select className={styles.select} ref={inputRef} {...props}>
        <option value="">Select value</option>
        {options?.map((option, index) => (
          <option key={`option_${index}`} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectOption;
