import styles from "./FilterPopup.module.scss";
import Input from "../../../../../components/Input/Input.tsx";
import { ChangeEvent } from "react";
import { formatFieldName } from "../../../../../libs/form.ts";

const FilterPopup = ({ inputsState, setInputsState }: any) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputsState((prevState: any) => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        value: value,
      },
    }));
  };

  return (
    <div className={styles.filter__popup}>
      {Object.keys(inputsState).map((input, index: number) => (
        <Input
          key={index}
          label={formatFieldName(inputsState[input].name)}
          name={input}
          type={input.includes("date") ? "date" : "text"}
          value={inputsState[input].value}
          onChange={handleChange}
        />
      ))}
    </div>
  );
};

export default FilterPopup;
