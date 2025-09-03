import Input from "@/components/Input/Input.tsx";
import styles from "./InputSection.module.scss";

interface InputField {
  name: string;
  label: string;
  placeholder: string;
  value?: string;
}

interface InputSectionProps {
  inputs: InputField[];
  onChange: (name: string, value: string) => void;
}

const InputSection = ({ inputs, onChange }: InputSectionProps) => {
  return (
    <div className={styles.input__section}>
      {inputs.map((field) => (
        <Input
          key={field.name}
          label={field.label}
          placeholder={field.placeholder}
          value={field.value || ""}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      ))}
    </div>
  );
};

export default InputSection;
