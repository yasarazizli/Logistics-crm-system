import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import styles from "../DynamicForm/DynamicForm.module.scss";
import Input from "@/components/Input/Input.tsx";

export interface DynamicFormData {
  shipper: string;
  consignee: string;
  notifyPartyValue: string;
  terminalValue: string;
  containerOwnerValue: string;
  wagonOwnerValue: string;
  containers: {
    number: string;
    dropOff: string;
  }[];
  wagons: {
    number: string;
    dropOff: string;
  }[];
}

export interface DynamicFormRef {
  getFormData: () => DynamicFormData;
  setFormData: (data: DynamicFormData) => void;
}

interface DynamicFormProps {
  onFormDataChange?: (data: DynamicFormData) => void;
}

const Shipper = forwardRef<DynamicFormRef, DynamicFormProps>(
  ({ onFormDataChange }, ref) => {
    const [form, setForm] = useState<DynamicFormData>({
      shipper: "",
      consignee: "",
      notifyPartyValue: "",
      terminalValue: "",
      containerOwnerValue: "",
      wagonOwnerValue: "",
      containers: [
        {
          number: "",
          dropOff: "",
        },
      ],
      wagons: [
        {
          number: "",
          dropOff: "",
        },
      ],
    });

    useImperativeHandle(ref, () => ({
      getFormData: () => form,
      setFormData: (data: DynamicFormData) => setForm(data),
    }));

    useEffect(() => {
      if (onFormDataChange) {
        onFormDataChange(form);
      }
    }, [form, onFormDataChange]);

    const handleTextChange = (
      field: "shipper" | "consignee",
      value: string,
    ) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleOptionalChange = (
      field:
        | "notifyPartyValue"
        | "terminalValue"
        | "containerOwnerValue"
        | "wagonOwnerValue",
      value: string,
    ) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleInputChange = (
      type: "containers" | "wagons",
      index: number,
      field: "number" | "dropOff",
      value: string,
    ) => {
      setForm((prev) => {
        const updated = [...prev[type]];
        updated[index] = {
          ...updated[index],
          [field]: value,
        };
        return { ...prev, [type]: updated };
      });
    };

    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>,
      type: "containers" | "wagons",
    ) => {
      if (e.key === "Enter") {
        e.preventDefault();
        setForm((prev) => ({
          ...prev,
          [type]: [
            ...prev[type],
            {
              number: "",
              dropOff: "",
            },
          ],
        }));
      }
    };

    const handleRemove = (type: "containers" | "wagons", index: number) => {
      setForm((prev) => {
        const updated = [...prev[type]];
        updated.splice(index, 1);
        return { ...prev, [type]: updated };
      });
    };

    return (
      <div className={styles.formContainer}>
        {/* Shipper & Consignee */}
        <div className={styles.input__box}>
          <div className={styles.formGroup}>
            <label>Shipper</label>
            <Input
              placeholder="Shipper"
              className={styles.input}
              value={form.shipper}
              onChange={(e) => handleTextChange("shipper", e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Consignee</label>
            <Input
              placeholder="Consignee"
              className={styles.input}
              value={form.consignee}
              onChange={(e) => handleTextChange("consignee", e.target.value)}
            />
          </div>

          {/* Checkboxsız inputlar */}
          <div className={styles.formGroup}>
            <label>Notify Party</label>
            <Input
              placeholder="Notify Party"
              className={styles.input}
              value={form.notifyPartyValue}
              onChange={(e) =>
                handleOptionalChange("notifyPartyValue", e.target.value)
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label>Terminal</label>
            <Input
              placeholder="Terminal"
              className={styles.input}
              value={form.terminalValue}
              onChange={(e) =>
                handleOptionalChange("terminalValue", e.target.value)
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label>Container Owner</label>
            <Input
              placeholder="Container Owner"
              className={styles.input}
              value={form.containerOwnerValue}
              onChange={(e) =>
                handleOptionalChange("containerOwnerValue", e.target.value)
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label>Wagon Owner</label>
            <Input
              placeholder="Wagon Owner"
              className={styles.input}
              value={form.wagonOwnerValue}
              onChange={(e) =>
                handleOptionalChange("wagonOwnerValue", e.target.value)
              }
            />
          </div>
        </div>

        {/* Containers */}
        {form.containers.map((c, index) => (
          <div key={`container-${index}`} className={styles.dynamicRow}>
            <div className={styles.wagon}>
              <label>Container №</label>
              <Input
                className={styles.input}
                value={c.number}
                placeholder="Container №"
                onChange={(e) =>
                  handleInputChange(
                    "containers",
                    index,
                    "number",
                    e.target.value,
                  )
                }
                onKeyDown={(e) => handleKeyDown(e, "containers")}
              />
            </div>
            {index > 0 && (
              <button
                className={styles.removeBtn}
                onClick={() => handleRemove("containers", index)}
              >
                X
              </button>
            )}
            <div className={styles.wagon}>
              <label>Drop-off</label>
              <Input
                className={styles.input}
                value={c.dropOff}
                placeholder="Drop-off"
                onChange={(e) =>
                  handleInputChange(
                    "containers",
                    index,
                    "dropOff",
                    e.target.value,
                  )
                }
                onKeyDown={(e) => handleKeyDown(e, "containers")}
              />
            </div>
          </div>
        ))}

        {/* Wagons */}
        {form.wagons.map((w, index) => (
          <div key={`wagon-${index}`} className={styles.dynamicRow}>
            <div className={styles.wagon}>
              <label>Wagon №</label>
              <Input
                className={styles.input}
                value={w.number}
                placeholder="Wagon №"
                onChange={(e) =>
                  handleInputChange("wagons", index, "number", e.target.value)
                }
                onKeyDown={(e) => handleKeyDown(e, "wagons")}
              />
            </div>
            {index > 0 && (
              <button
                className={styles.removeBtn}
                onClick={() => handleRemove("wagons", index)}
              >
                X
              </button>
            )}
            <div className={styles.wagon}>
              <label>Drop-off</label>
              <Input
                className={styles.input}
                value={w.dropOff}
                placeholder="Drop-off"
                onChange={(e) =>
                  handleInputChange("wagons", index, "dropOff", e.target.value)
                }
                onKeyDown={(e) => handleKeyDown(e, "wagons")}
              />
            </div>
          </div>
        ))}
      </div>
    );
  },
);

export default Shipper;
