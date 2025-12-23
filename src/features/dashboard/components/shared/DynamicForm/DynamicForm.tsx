import {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
} from "react";
import styles from "../DynamicForm/DynamicForm.module.scss";
import Input from "@/components/Input/Input.tsx";
import { InformationIcon, LineIcon } from "@/assets/icons/shared.vectors.tsx";

export interface DynamicFormData {
  shipper: string;
  consignee: string;
  notifyParty: boolean;
  terminal: boolean;
  containerOwner: boolean;
  wagonOwner: boolean;
  notifyPartyValue: number | null;
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

export interface DynamicFormRef {
  getFormData: () => DynamicFormData;
  setFormData: (data: DynamicFormData) => void;
}

interface DynamicFormProps {
  onFormDataChange?: (data: DynamicFormData) => void;
}

const DynamicForm = forwardRef<DynamicFormRef, DynamicFormProps>(
  ({ onFormDataChange }, ref) => {
    const [form, setForm] = useState<DynamicFormData>({
      shipper: "",
      consignee: "",
      notifyParty: false,
      terminal: false,
      containerOwner: false,
      wagonOwner: false,
      notifyPartyValue: null,
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

    const [open, setOpen] = useState(false);

    const formRef = useRef(form);
    formRef.current = form;

    const onFormDataChangeRef = useRef(onFormDataChange);
    onFormDataChangeRef.current = onFormDataChange;

    const processPastedValues = (
      values: string,
      type: "containers" | "wagons",
    ): string[] => {
      const separators = /\n|,|;|\t/;
      return values
        .split(separators)
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
        .map((item) => {
          if (type === "containers") {
            const formatted = item.replace(/[^a-zA-Z0-9]/g, "");
            const letters = formatted.slice(0, 4).replace(/[^a-zA-Z]/g, "");
            const numbers = formatted
              .slice(4)
              .replace(/[^0-9]/g, "")
              .slice(0, 7);
            return letters + numbers;
          }

          if (type === "wagons") {
            return item.replace(/[^0-9]/g, "").slice(0, 7);
          }

          return item;
        });
    };

    useImperativeHandle(ref, () => ({
      getFormData: () => formRef.current,
      setFormData: (data: DynamicFormData) => {
        setForm(data);
      },
    }));

    useEffect(() => {
      if (onFormDataChangeRef.current) {
        onFormDataChangeRef.current(form);
      }
    }, [form]);

    const handleToggle = (field: keyof DynamicFormData) => {
      setForm((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleInputChange = (field: keyof DynamicFormData, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleNotifyPartyChange = (value: string) => {
      const numValue = value === "" ? null : Number(value);
      setForm((prev) => ({ ...prev, notifyPartyValue: numValue }));
    };

    const handleContainerWagonChange = (
      type: "containers" | "wagons",
      index: number,
      field: "number" | "dropOff" | "requiredNumber" | "requiredDropOff",
      value: string | boolean,
    ) => {
      if (field === "number" && typeof value === "string") {
        let formatted = value;
        formatted = formatted.replace(/[^a-zA-Z0-9]/g, "");
        const letters = formatted.slice(0, 4).replace(/[^a-zA-Z]/g, "");
        const numbers = formatted
          .slice(4)
          .replace(/[^0-9]/g, "")
          .slice(0, 7);
        value = letters + numbers;
      }
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

    const handlePaste = (
      e: React.ClipboardEvent<HTMLInputElement>,
      type: "containers" | "wagons",
      index: number,
      field: "number" | "dropOff",
    ) => {
      e.preventDefault();

      const pastedText = e.clipboardData.getData("text");

      if (field === "number") {
        const processedValues = processPastedValues(pastedText, type);

        if (processedValues.length === 0) return;

        setForm((prev) => {
          const currentArray = [...prev[type]];
          const isFirstItem =
            currentArray.length === 1 && currentArray[0].number === "";

          if (isFirstItem && index === 0) {
            const newItems = [];

            for (let i = 0; i < processedValues.length; i++) {
              newItems.push({
                number: processedValues[i],
                dropOff: "",
                requiredNumber:
                  i === 0 ? currentArray[0].requiredNumber : false,
                requiredDropOff:
                  i === 0 ? currentArray[0].requiredDropOff : false,
              });
            }

            return { ...prev, [type]: newItems };
          } else {
            const updated = [...currentArray];

            updated[index] = {
              ...updated[index],
              number: processedValues[0],
            };

            for (let i = 1; i < processedValues.length; i++) {
              updated.push({
                number: processedValues[i],
                dropOff: "",
                requiredNumber: false,
                requiredDropOff: false,
              });
            }

            return { ...prev, [type]: updated };
          }
        });
      } else {
        const pastedValue =
          pastedText.split("\n")[0] || pastedText.split(",")[0];
        handleContainerWagonChange(type, index, field, pastedValue);
      }
    };

    const handleRemove = (type: "containers" | "wagons", index: number) => {
      setForm((prev) => {
        const updated = [...prev[type]];
        updated.splice(index, 1);

        if (updated.length === 0) {
          updated.push({
            number: "",
            dropOff: "",
            requiredNumber: false,
            requiredDropOff: false,
          });
        }

        return { ...prev, [type]: updated };
      });
    };

    return (
      <div className={styles.formContainer}>
        <div className={styles.input__box}>
          <div className={styles.formGroup}>
            <div className={styles.red}>
              <label>Shipper</label>
              <div style={{ color: "red", paddingTop: "8px" }}>*</div>
            </div>
            <Input
              placeholder="Shipper"
              className={styles.input}
              value={form.shipper}
              onChange={(e) => handleInputChange("shipper", e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <div className={styles.red}>
              <label>Consignee</label>
              <div style={{ color: "red", paddingTop: "8px" }}>*</div>
            </div>
            <Input
              placeholder="Consignee"
              className={styles.input}
              value={form.consignee}
              onChange={(e) => handleInputChange("consignee", e.target.value)}
            />
          </div>

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
              value={
                form.notifyPartyValue === null
                  ? ""
                  : form.notifyPartyValue.toString()
              }
              disabled={!form.notifyParty}
              onChange={(e) => handleNotifyPartyChange(e.target.value)}
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
                handleInputChange("terminalValue", e.target.value)
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
                handleInputChange("containerOwnerValue", e.target.value)
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
                handleInputChange("wagonOwnerValue", e.target.value)
              }
            />
          </div>
        </div>

        <div className={styles.section}>
          {form.containers.map((c, index) => (
            <div key={`container-${index}`} className={styles.dynamicRow}>
              <div className={styles.wagon}>
                <div className={styles.info}>
                  <label>
                    {index === 0 && (
                      <input
                        type="checkbox"
                        checked={c.requiredNumber || false}
                        onChange={() =>
                          handleContainerWagonChange(
                            "containers",
                            index,
                            "requiredNumber",
                            !(c.requiredNumber || false),
                          )
                        }
                        className={styles.custom_checkbox}
                      />
                    )}
                    Container {index > 0 && `${index + 1}`}
                  </label>
                  {index === 0 && (
                    <div
                      className={styles.tooltipWrapper}
                      onClick={() => setOpen(!open)}
                    >
                      <InformationIcon />

                      {open && (
                        <div className={styles.tooltipBlock}>
                          <div className={styles.box}>
                            4 letters + 7 numbers
                          </div>
                          <div className={styles.lineIcon}>
                            <LineIcon />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <Input
                  className={styles.input}
                  value={c.number}
                  placeholder="Container №"
                  disabled={index > 0 ? false : !c.requiredNumber}
                  onChange={(e) =>
                    handleContainerWagonChange(
                      "containers",
                      index,
                      "number",
                      e.target.value,
                    )
                  }
                  onKeyDown={(e) => handleKeyDown(e, "containers")}
                  onPaste={(e) => handlePaste(e, "containers", index, "number")}
                />
              </div>

              <div className={styles.wagon}>
                <div className={styles.info}>
                  <label>
                    {index === 0 && (
                      <input
                        type="checkbox"
                        checked={c.requiredDropOff || false}
                        onChange={() =>
                          handleContainerWagonChange(
                            "containers",
                            index,
                            "requiredDropOff",
                            !(c.requiredDropOff || false),
                          )
                        }
                        className={styles.custom_checkbox}
                      />
                    )}
                    Drop-off {index > 0 && `${index + 1}`}
                  </label>
                </div>
                <Input
                  className={styles.input}
                  value={c.dropOff}
                  placeholder="Drop-off"
                  disabled={index > 0 ? false : !c.requiredDropOff}
                  onChange={(e) =>
                    handleContainerWagonChange(
                      "containers",
                      index,
                      "dropOff",
                      e.target.value,
                    )
                  }
                  onKeyDown={(e) => handleKeyDown(e, "containers")}
                  onPaste={(e) =>
                    handlePaste(e, "containers", index, "dropOff")
                  }
                />
              </div>

              {index > 0 && (
                <button
                  className={styles.removeBtn}
                  onClick={() => handleRemove("containers", index)}
                  type="button"
                  title="Remove this container"
                >
                  X
                </button>
              )}
            </div>
          ))}
        </div>

        <div className={styles.section}>
          {form.wagons.map((w, index) => (
            <div key={`wagon-${index}`} className={styles.dynamicRow}>
              <div className={styles.wagon}>
                <div className={styles.info}>
                  <label>
                    {index === 0 && (
                      <input
                        type="checkbox"
                        checked={w.requiredNumber || false}
                        onChange={() =>
                          handleContainerWagonChange(
                            "wagons",
                            index,
                            "requiredNumber",
                            !(w.requiredNumber || false),
                          )
                        }
                        className={styles.custom_checkbox}
                      />
                    )}
                    Wagon {index > 0 && `${index + 1}`}
                  </label>
                </div>
                <Input
                  className={styles.input}
                  value={w.number}
                  placeholder="Wagon №"
                  maxLength={7}
                  disabled={index > 0 ? false : !w.requiredNumber}
                  onChange={(e) =>
                    handleContainerWagonChange(
                      "wagons",
                      index,
                      "number",
                      e.target.value,
                    )
                  }
                  onKeyDown={(e) => handleKeyDown(e, "wagons")}
                  onPaste={(e) => handlePaste(e, "wagons", index, "number")}
                />
              </div>

              <div className={styles.wagon}>
                <div className={styles.info}>
                  <label>
                    {index === 0 && (
                      <input
                        type="checkbox"
                        checked={w.requiredDropOff || false}
                        onChange={() =>
                          handleContainerWagonChange(
                            "wagons",
                            index,
                            "requiredDropOff",
                            !(w.requiredDropOff || false),
                          )
                        }
                        className={styles.custom_checkbox}
                      />
                    )}
                    Drop-off {index > 0 && `${index + 1}`}
                  </label>
                </div>
                <Input
                  className={styles.input}
                  value={w.dropOff}
                  placeholder="Drop-off"
                  disabled={index > 0 ? false : !w.requiredDropOff}
                  onChange={(e) =>
                    handleContainerWagonChange(
                      "wagons",
                      index,
                      "dropOff",
                      e.target.value,
                    )
                  }
                  onKeyDown={(e) => handleKeyDown(e, "wagons")}
                  onPaste={(e) => handlePaste(e, "wagons", index, "dropOff")}
                />
              </div>

              {index > 0 && (
                <button
                  className={styles.removeBtn}
                  onClick={() => handleRemove("wagons", index)}
                  type="button"
                  title="Remove this wagon"
                >
                  X
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  },
);

export default DynamicForm;
