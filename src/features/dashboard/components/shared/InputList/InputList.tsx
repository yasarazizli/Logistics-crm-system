import Input from "@/components/Input/Input.tsx";
import { ChangeEvent } from "react";

interface Filed {
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

interface InputLIstProps {
  fields: Filed[];
}

const InputList = ({ fields }: InputLIstProps) => {
  return (
    <div>
      {fields.map((field, index) => (
        <Input key={index} {...field} />
      ))}
    </div>
  );
};

export default InputList;
