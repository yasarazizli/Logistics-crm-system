import {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
} from "react";
import styles from "../DynamicForm/DynamicForm.module.scss";
import Input from "@/components/Input/Input.tsx";

export interface DynamicFormData {
  shipper: string;
  consignee: string;
  notifyPartyValue: number | null;
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
        },
      ],
      wagons: [
        {
          number: "",
          dropOff: "",
        },
      ],
    });

    const formRef = useRef(form);
    formRef.current = form;

    const onFormDataChangeRef = useRef(onFormDataChange);
    onFormDataChangeRef.current = onFormDataChange;

    useImperativeHandle(ref, () => ({
      getFormData: () => {
        const currentForm = formRef.current;

        const allContainerNumbers = currentForm.containers
          .filter((container) => container.number.trim() !== "")
          .map((container) => container.number)
          .join(", ");

        const allContainerDropOffs = currentForm.containers
          .filter((container) => container.dropOff.trim() !== "")
          .map((container) => container.dropOff)
          .join(", ");

        const allWagonNumbers = currentForm.wagons
          .filter((wagon) => wagon.number.trim() !== "")
          .map((wagon) => wagon.number)
          .join(", ");

        const allWagonDropOffs = currentForm.wagons
          .filter((wagon) => wagon.dropOff.trim() !== "")
          .map((wagon) => wagon.dropOff)
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
            .map((num: string) => num.trim())
            .filter((num: string) => num !== "");

          const containerDropOffs =
            apiData.container_drop_off &&
            apiData.container_drop_off.trim() !== ""
              ? apiData.container_drop_off
                  .split(",")
                  .map((drop: string) => drop.trim())
                  .filter((drop: string) => drop !== "")
              : Array(containerNumbers.length).fill("");

          for (let i = 0; i < containerNumbers.length; i++) {
            containersArray.push({
              number: containerNumbers[i] || "",
              dropOff: containerDropOffs[i] || "",
            });
          }
        } else {
          containersArray.push({ number: "", dropOff: "" });
        }

        const wagonsArray = [];
        if (apiData.wagon_no && apiData.wagon_no.trim() !== "") {
          const wagonNumbers = apiData.wagon_no
            .split(",")
            .map((num: string) => num.trim())
            .filter((num: string) => num !== "");

          const wagonDropOffs =
            apiData.wagon_drop_off && apiData.wagon_drop_off.trim() !== ""
              ? apiData.wagon_drop_off
                  .split(",")
                  .map((drop: string) => drop.trim())
                  .filter((drop: string) => drop !== "")
              : Array(wagonNumbers.length).fill("");

          for (let i = 0; i < wagonNumbers.length; i++) {
            wagonsArray.push({
              number: wagonNumbers[i] || "",
              dropOff: wagonDropOffs[i] || "",
            });
          }
        } else {
          wagonsArray.push({ number: "", dropOff: "" });
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
    ) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleNotifyPartyChange = (value: string) => {
      if (value === "" || value === null) {
        setForm((prev) => ({ ...prev, notifyPartyValue: null }));
      } else {
        const numericValue = value.replace(/[^\d]/g, "");
        if (numericValue === "") {
          setForm((prev) => ({ ...prev, notifyPartyValue: null }));
        } else {
          setForm((prev) => ({
            ...prev,
            notifyPartyValue: parseInt(numericValue, 10),
          }));
        }
      }
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

          <div className={styles.formGroup}>
            <label>Notify Party</label>
            <Input
              placeholder="Notify Party (Number only)"
              className={styles.input}
              type="text"
              value={
                form.notifyPartyValue === null
                  ? ""
                  : form.notifyPartyValue.toString()
              }
              onChange={(e) => handleNotifyPartyChange(e.target.value)}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
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

        <div className={styles.section}>
          {form.containers.map((c, index) => (
            <div
              key={`container-${index}-${c.number}`}
              className={styles.dynamicRow}
            >
              <div className={styles.wagon}>
                <label>Container {index > 0 && `${index + 1}`}</label>
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
              <div className={styles.wagon}>
                <label>Drop-off {index > 0 && `${index + 1}`}</label>
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
              {index > 0 && (
                <button
                  className={styles.removeBtn}
                  onClick={() => handleRemove("containers", index)}
                >
                  X
                </button>
              )}
            </div>
          ))}
        </div>

        <div className={styles.section}>
          {form.wagons.map((w, index) => (
            <div
              key={`wagon-${index}-${w.number}`}
              className={styles.dynamicRow}
            >
              <div className={styles.wagon}>
                <label>Wagon {index > 0 && `${index + 1}`}</label>
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
              <div className={styles.wagon}>
                <label>Drop-off {index > 0 && `${index + 1}`}</label>
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
            </div>
          ))}
        </div>
      </div>
    );
  },
);

export default Shipper;
