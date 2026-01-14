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
  notifyPartyValue: number | string | null;
  terminalValue: string;
  containerOwnerValue: string;
  wagonOwnerValue: string;
  containers: {
    number: string;
    dropOff: string;
    requiredNumber: boolean;
    requiredDropOff: boolean;
  }[];
  wagons: {
    number: string;
    dropOff: string;
    requiredNumber: boolean;
    requiredDropOff: boolean;
  }[];
  containerNumbers?: string;
  containerDropOffs?: string;
  wagonNumbers?: string;
  wagonDropOffs?: string;
}

export interface DynamicFormRef {
  getFormData: () => DynamicFormData;
  setFormData: (data: any) => void;
}

interface DynamicFormProps {
  onFormDataChange?: (data: DynamicFormData) => void;
}

const Shipper = forwardRef<DynamicFormRef, DynamicFormProps>(
  ({ onFormDataChange }, ref) => {
    const [form, setForm] = useState<DynamicFormData>({
      shipper: "",
      consignee: "",
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

    const inputRefs = useRef<{
      containers: HTMLInputElement[];
      wagons: HTMLInputElement[];
    }>({
      containers: [],
      wagons: [],
    });

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
      getFormData: () => {
        const currentForm = formRef.current;

        const allContainerNumbers = currentForm.containers
          .filter((c) => c.number.trim() !== "")
          .map((c) => c.number)
          .join(", ");

        const allContainerDropOffs = currentForm.containers
          .filter((c) => c.dropOff.trim() !== "")
          .map((c) => c.dropOff)
          .join(", ");

        const allWagonNumbers = currentForm.wagons
          .filter((w) => w.number.trim() !== "")
          .map((w) => w.number)
          .join(", ");

        const allWagonDropOffs = currentForm.wagons
          .filter((w) => w.dropOff.trim() !== "")
          .map((w) => w.dropOff)
          .join(", ");

        return {
          ...currentForm,
          containerNumbers: allContainerNumbers,
          containerDropOffs: allContainerDropOffs,
          wagonNumbers: allWagonNumbers,
          wagonDropOffs: allWagonDropOffs,
        };
      },
      setFormData: (apiData: any) => {
        const containersArray = [];
        if (apiData.container_no && apiData.container_no.trim() !== "") {
          const containerNumbers = apiData.container_no
            .split(",")
            .map((n: string) => n.trim())
            .filter((n: string) => n !== "");

          const containerDropOffs =
            apiData.container_drop_off &&
            apiData.container_drop_off.trim() !== ""
              ? apiData.container_drop_off
                  .split(",")
                  .map((d: string) => d.trim())
                  .filter((d: string) => d !== "")
              : Array(containerNumbers.length).fill("");

          for (let i = 0; i < containerNumbers.length; i++) {
            containersArray.push({
              number: containerNumbers[i] || "",
              dropOff: containerDropOffs[i] || "",
              requiredNumber: apiData.container_no_required || false,
              requiredDropOff: apiData.container_drop_off_required || false,
            });
          }
        } else {
          containersArray.push({
            number: "",
            dropOff: "",
            requiredNumber: false,
            requiredDropOff: false,
          });
        }

        const wagonsArray = [];
        if (apiData.wagon_no && apiData.wagon_no.trim() !== "") {
          const wagonNumbers = apiData.wagon_no
            .split(",")
            .map((n: string) => n.trim())
            .filter((n: string) => n !== "");

          const wagonDropOffs =
            apiData.wagon_drop_off && apiData.wagon_drop_off.trim() !== ""
              ? apiData.wagon_drop_off
                  .split(",")
                  .map((d: string) => d.trim())
                  .filter((d: string) => d !== "")
              : Array(wagonNumbers.length).fill("");

          for (let i = 0; i < wagonNumbers.length; i++) {
            wagonsArray.push({
              number: wagonNumbers[i] || "",
              dropOff: wagonDropOffs[i] || "",
              requiredNumber: apiData.wagon_no_required || false,
              requiredDropOff: apiData.wagon_drop_off_required || false,
            });
          }
        } else {
          wagonsArray.push({
            number: "",
            dropOff: "",
            requiredNumber: false,
            requiredDropOff: false,
          });
        }

        const formData: DynamicFormData = {
          shipper: apiData.shipper || "",
          consignee: apiData.consignee || "",
          notifyPartyValue:
            apiData.notify_party !== null && apiData.notify_party !== undefined
              ? apiData.notify_party
              : null,
          terminalValue: apiData.terminal || "",
          containerOwnerValue: apiData.container_owner || "",
          wagonOwnerValue: apiData.wagon_owner || "",
          containers: containersArray,
          wagons: wagonsArray,
        };

        setForm(formData);
      },
    }));

    useEffect(() => {
      if (onFormDataChangeRef.current) {
        onFormDataChangeRef.current(form);
      }
    }, [form]);

    const handleTextChange = (
      field:
        | "shipper"
        | "consignee"
        | "terminalValue"
        | "containerOwnerValue"
        | "wagonOwnerValue",
      value: string,
    ) => setForm((prev) => ({ ...prev, [field]: value }));

    const handleNotifyPartyChange = (value: string) => {
      const parsedValue =
        value === "" ? null : isNaN(Number(value)) ? value : Number(value);

      setForm((prev) => ({
        ...prev,
        notifyPartyValue: parsedValue,
      }));
    };

    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>,
      type: "containers" | "wagons",
    ) => {
      if (e.key === "Enter") {
        e.preventDefault();
        setForm((prev) => {
          const newItems = [
            ...prev[type],
            {
              number: "",
              dropOff: "",
              requiredNumber: false,
              requiredDropOff: false,
            },
          ];
          setTimeout(() => {
            const lastIndex = newItems.length - 1;
            inputRefs.current[type][lastIndex]?.focus();
          }, 0);
          return { ...prev, [type]: newItems };
        });
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "v") {
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
          const updated = [...prev[type]];

          if (processedValues.length === 1) {
            updated[index] = {
              ...updated[index],
              number: processedValues[0],
            };
            return { ...prev, [type]: updated };
          }

          updated[index] = {
            ...updated[index],
            number: processedValues[0],
          };

          const newItems = [...updated];
          for (let i = 1; i < processedValues.length; i++) {
            newItems.push({
              number: processedValues[i],
              dropOff: "",
              requiredNumber: false,
              requiredDropOff: false,
            });
          }

          const hasDropOffInfo = pastedText.includes(":");
          if (hasDropOffInfo) {
            const pairs = pastedText
              .split("\n")
              .filter((pair) => pair.includes(":"));
            pairs.forEach((pair, pairIndex) => {
              const [num, drop] = pair.split(":").map((s) => s.trim());
              if (pairIndex < newItems.length) {
                newItems[pairIndex] = {
                  ...newItems[pairIndex],
                  number:
                    processPastedValues(num, type)[0] ||
                    newItems[pairIndex].number,
                  dropOff: drop || newItems[pairIndex].dropOff,
                };
              }
            });
          }

          return { ...prev, [type]: newItems };
        });

        setTimeout(() => {
          const newIndex = index + processedValues.length - 1;
          if (inputRefs.current[type][newIndex]) {
            inputRefs.current[type][newIndex].focus();
          }
        }, 50);
      } else {
        const pastedValue =
          pastedText.split("\n")[0] || pastedText.split(",")[0];
        handleInputChange(type, index, field, pastedValue);
      }
    };

    const handleInputChange = (
      type: "containers" | "wagons",
      index: number,
      field: "number" | "dropOff",
      value: string,
    ) => {
      if (type === "containers" && field === "number") {
        let formatted = value;
        formatted = formatted.replace(/[^a-zA-Z0-9]/g, "");
        const letters = formatted.slice(0, 4).replace(/[^a-zA-Z]/g, "");
        const numbers = formatted
          .slice(4)
          .replace(/[^0-9]/g, "")
          .slice(0, 7);
        value = letters + numbers;

        if (value.length === 11 && value.trim() !== "") {
          setTimeout(() => {
            const nextIndex = index + 1;
            if (inputRefs.current[type][nextIndex]) {
              inputRefs.current[type][nextIndex].focus();
            } else {
              setForm((prev) => {
                const newItems = [
                  ...prev[type],
                  {
                    number: "",
                    dropOff: "",
                    requiredNumber: false,
                    requiredDropOff: false,
                  },
                ];
                setTimeout(() => {
                  inputRefs.current[type][newItems.length - 1]?.focus();
                }, 0);
                return { ...prev, [type]: newItems };
              });
            }
          }, 100);
        }
      }

      if (type === "wagons" && field === "number") {
        value = value.replace(/[^0-9]/g, "").slice(0, 7);

        if (value.length === 7 && value.trim() !== "") {
          setTimeout(() => {
            const nextIndex = index + 1;
            if (inputRefs.current[type][nextIndex]) {
              inputRefs.current[type][nextIndex].focus();
            } else {
              setForm((prev) => {
                const newItems = [
                  ...prev[type],
                  {
                    number: "",
                    dropOff: "",
                    requiredNumber: false,
                    requiredDropOff: false,
                  },
                ];
                setTimeout(() => {
                  inputRefs.current[type][newItems.length - 1]?.focus();
                }, 0);
                return { ...prev, [type]: newItems };
              });
            }
          }, 100);
        }
      }

      setForm((prev) => {
        const updated = [...prev[type]];
        updated[index] = { ...updated[index], [field]: value };
        return { ...prev, [type]: updated };
      });
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

    const [open, setOpen] = useState(false);

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
              onChange={(e) => handleTextChange("shipper", e.target.value)}
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
              onChange={(e) => handleTextChange("consignee", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Notify Party</label>
            <Input
              placeholder="Notify Party"
              className={styles.input}
              type="text"
              value={form.notifyPartyValue?.toString() || ""}
              onChange={(e) => handleNotifyPartyChange(e.target.value)}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) e.preventDefault();
              }}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Terminal</label>
            <Input
              placeholder="Terminal"
              className={styles.input}
              value={form.terminalValue}
              onChange={(e) =>
                handleTextChange("terminalValue", e.target.value)
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
                handleTextChange("containerOwnerValue", e.target.value)
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
                handleTextChange("wagonOwnerValue", e.target.value)
              }
            />
          </div>
        </div>

        {/* Containers */}
        <div className={styles.section}>
          {form.containers.map((c, index) => (
            <div key={`container-${index}`} className={styles.dynamicRow}>
              <div className={styles.wagon}>
                <div className={styles.info}>
                  <label>Container {index > 0 ? `${index + 1}` : ""}</label>
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
                  inputRef={(el: HTMLInputElement | null) => {
                    if (el) inputRefs.current.containers[index] = el;
                  }}
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
                  onPaste={(e) => handlePaste(e, "containers", index, "number")}
                />
              </div>
              <div className={styles.wagon}>
                <div className={styles.info}>
                  <label>Drop-off {index > 0 ? `${index + 1}` : ""}</label>
                </div>
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

        {/* Wagons */}
        <div className={styles.section}>
          {form.wagons.map((w, index) => (
            <div key={`wagon-${index}`} className={styles.dynamicRow}>
              <div className={styles.wagon}>
                <div className={styles.info}>
                  <label>Wagon {index > 0 ? `${index + 1}` : ""}</label>
                </div>
                <Input
                  inputRef={(el: HTMLInputElement | null) => {
                    if (el) inputRefs.current.wagons[index] = el;
                  }}
                  maxLength={7}
                  className={styles.input}
                  value={w.number}
                  placeholder="Wagon №"
                  onChange={(e) =>
                    handleInputChange("wagons", index, "number", e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(e, "wagons")}
                  onPaste={(e) => handlePaste(e, "wagons", index, "number")}
                />
              </div>
              <div className={styles.wagon}>
                <div className={styles.info}>
                  <label>Drop-off {index > 0 ? `${index + 1}` : ""}</label>
                </div>
                <Input
                  className={styles.input}
                  value={w.dropOff}
                  placeholder="Drop-off"
                  onChange={(e) =>
                    handleInputChange(
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

export default Shipper;
