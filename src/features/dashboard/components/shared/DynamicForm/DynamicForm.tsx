import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import styles from "./DynamicForm.module.scss";
import Input from "@/components/Input/Input.tsx";

export interface DynamicFormData {
  shipper: string;
  consignee: string;
  notifyParty: boolean;
  terminal: boolean;
  containerOwner: boolean;
  wagonOwner: boolean;
  notifyPartyValue: string;
  terminalValue: string;
  containerOwnerValue: string;
  wagonOwnerValue: string;
  containers: {
    number: string;
    dropOff: string;
    requiredNumber?: boolean;
    requiredDropOff?: boolean;
  }[];
  wagons: {
    number: string;
    dropOff: string;
    requiredNumber?: boolean;
    requiredDropOff?: boolean;
  }[];
}

interface DynamicFormProps {
  onFormDataChange?: (data: DynamicFormData) => void;
}

const DynamicForm = forwardRef<unknown, DynamicFormProps>(
  ({ onFormDataChange }, ref) => {
    const [form, setForm] = useState<DynamicFormData>({
      shipper: "",
      consignee: "",
      notifyParty: false,
      terminal: false,
      containerOwner: false,
      wagonOwner: false,
      notifyPartyValue: "",
      terminalValue: "",
      containerOwnerValue: "",
      wagonOwnerValue: "",
      containers: [
        {
          number: "",
          dropOff: "",
          requiredNumber: false,
          requiredDropOff: false,
        },
      ],
      wagons: [
        {
          number: "",
          dropOff: "",
          requiredNumber: false,
          requiredDropOff: false,
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

    const handleToggle = (field: keyof DynamicFormData) => {
      setForm((prev) => ({ ...prev, [field]: !prev[field] }));
    };

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
      field: "number" | "dropOff" | "requiredNumber" | "requiredDropOff",
      value: string | boolean,
    ) => {
      setForm((prev) => {
        const updated = [...prev[type]];
        (updated[index] as any)[field] = value;
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
              requiredNumber: false,
              requiredDropOff: false,
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

          {/* Checkbox ilə açılıb-bağlanan inputlar */}
          <div className={styles.formGroup}>
            <label>
              <input
                type="checkbox"
                checked={form.notifyParty}
                onChange={() => handleToggle("notifyParty")}
                className={styles.custom_checkbox}
              />
              Notify Party
            </label>
            <Input
              placeholder="Notify Party"
              className={styles.input}
              value={form.notifyPartyValue}
              disabled={!form.notifyParty}
              onChange={(e) =>
                handleOptionalChange("notifyPartyValue", e.target.value)
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              <input
                type="checkbox"
                checked={form.terminal}
                onChange={() => handleToggle("terminal")}
                className={styles.custom_checkbox}
              />
              Terminal
            </label>
            <Input
              placeholder="Terminal"
              className={styles.input}
              value={form.terminalValue}
              disabled={!form.terminal}
              onChange={(e) =>
                handleOptionalChange("terminalValue", e.target.value)
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              <input
                type="checkbox"
                checked={form.containerOwner}
                onChange={() => handleToggle("containerOwner")}
                className={styles.custom_checkbox}
              />
              Container Owner
            </label>
            <Input
              placeholder="Container Owner"
              className={styles.input}
              value={form.containerOwnerValue}
              disabled={!form.containerOwner}
              onChange={(e) =>
                handleOptionalChange("containerOwnerValue", e.target.value)
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              <input
                type="checkbox"
                checked={form.wagonOwner}
                onChange={() => handleToggle("wagonOwner")}
                className={styles.custom_checkbox}
              />
              Wagon Owner
            </label>
            <Input
              placeholder="Wagon Owner"
              className={styles.input}
              value={form.wagonOwnerValue}
              disabled={!form.wagonOwner}
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
              <label>
                <input
                  type="checkbox"
                  checked={c.requiredNumber || false}
                  onChange={() =>
                    handleInputChange(
                      "containers",
                      index,
                      "requiredNumber",
                      !(c.requiredNumber || false),
                    )
                  }
                  className={styles.custom_checkbox}
                />
                Container №
              </label>
              <Input
                className={styles.input}
                value={c.number}
                placeholder="Container №"
                disabled={!c.requiredNumber}
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
              <label>
                <input
                  type="checkbox"
                  checked={c.requiredDropOff || false}
                  onChange={() =>
                    handleInputChange(
                      "containers",
                      index,
                      "requiredDropOff",
                      !(c.requiredDropOff || false),
                    )
                  }
                  className={styles.custom_checkbox}
                />
                Drop-off
              </label>
              <Input
                className={styles.input}
                value={c.dropOff}
                placeholder="Drop-off"
                disabled={!c.requiredDropOff}
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
              <label>
                <input
                  type="checkbox"
                  checked={w.requiredNumber || false}
                  onChange={() =>
                    handleInputChange(
                      "wagons",
                      index,
                      "requiredNumber",
                      !(w.requiredNumber || false),
                    )
                  }
                  className={styles.custom_checkbox}
                />
                Wagon №
              </label>
              <Input
                className={styles.input}
                value={w.number}
                placeholder="Wagon №"
                disabled={!w.requiredNumber}
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
              <label>
                <input
                  type="checkbox"
                  checked={w.requiredDropOff || false}
                  onChange={() =>
                    handleInputChange(
                      "wagons",
                      index,
                      "requiredDropOff",
                      !(w.requiredDropOff || false),
                    )
                  }
                  className={styles.custom_checkbox}
                />
                Drop-off
              </label>
              <Input
                className={styles.input}
                value={w.dropOff}
                placeholder="Drop-off"
                disabled={!w.requiredDropOff}
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

export default DynamicForm;
