import { forwardRef, useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./DateInput.module.scss";

type DateInputProps = {
  label: string;
  onChange?: (date: Date | null) => void;
};

const DateInput = ({ label, onChange, ...props }: DateInputProps) => {
  const [startDate, setStartDate] = useState<Date | null>(null);

  // @ts-ignore
  // eslint-disable-next-line react/display-name
  const CustomDateInput = forwardRef(({ value, onClick }, ref) => {
    return (
      <>
        <label className={styles.date__input}>
          <span>{label}</span>
          <div className={styles.date__input__box} onClick={onClick}>
            <input value={value || "Select date"} onChange={() => {}} />
          </div>
        </label>
      </>
    );
  });

  const changeDate = (date: Date | null) => {
    setStartDate(date);
    if (onChange) {
      onChange(date);
    }
  };

  return (
    <div className={styles.date__input}>
      <DatePicker
        selected={startDate}
        onChange={changeDate}
        customInput={<CustomDateInput />}
        {...props}
      />
    </div>
  );
};

export default DateInput;
