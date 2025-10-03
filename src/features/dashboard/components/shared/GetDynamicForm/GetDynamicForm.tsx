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
  setFormData: (data: any) => void;
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

    const formRef = useRef(form);
    formRef.current = form;

    const onFormDataChangeRef = useRef(onFormDataChange);
    onFormDataChangeRef.current = onFormDataChange;

    useImperativeHandle(ref, () => ({
      getFormData: () => formRef.current,
      setFormData: (apiData: any) => {
        console.log("API-dən gələn məlumat:", apiData);

        // Helper function to convert comma-separated string to array of objects
        const createArrayFromString = (
          numbersString: string,
          dropOffsString: string,
          numbersRequired: boolean,
          dropOffsRequired: boolean,
        ) => {
          if (!numbersString || numbersString.trim() === "") {
            return [
              {
                number: "",
                dropOff: "",
                requiredNumber: numbersRequired,
                requiredDropOff: dropOffsRequired,
              },
            ];
          }

          const numbers = numbersString.split(",").map((item) => item.trim());
          const dropOffs =
            dropOffsString && dropOffsString.trim() !== ""
              ? dropOffsString.split(",").map((item) => item.trim())
              : Array(numbers.length).fill("");

          return numbers.map((number, index) => ({
            number: number || "",
            dropOff: dropOffs[index] || "",
            requiredNumber: numbersRequired,
            requiredDropOff: dropOffsRequired,
          }));
        };

        const formData: DynamicFormData = {
          shipper: apiData.shipper || "",
          consignee: apiData.consignee || "",
          notifyParty: apiData.notify_party_required || false,
          terminal: apiData.terminal_required || false,
          containerOwner: apiData.container_owner_required || false,
          wagonOwner: apiData.wagon_owner_required || false,
          notifyPartyValue:
            apiData.notify_party !== null && apiData.notify_party !== undefined
              ? apiData.notify_party
              : null,
          terminalValue: apiData.terminal || "",
          containerOwnerValue: apiData.container_owner || "",
          wagonOwnerValue: apiData.wagon_owner || "",

          containers: createArrayFromString(
            apiData.container_no,
            apiData.container_drop_off,
            apiData.container_no_required || false,
            apiData.container_drop_off_required || false,
          ),

          wagons: createArrayFromString(
            apiData.wagon_no,
            apiData.wagon_drop_off,
            apiData.wagon_no_required || false,
            apiData.wagon_drop_off_required || false,
          ),
        };

        console.log("Çevrilmiş form data:", formData);
        setForm(formData);
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
        <div className={styles.input__box}>
          <div className={styles.formGroup}>
            <label>Shipper</label>
            <Input
              placeholder="Shipper"
              className={styles.input}
              value={form.shipper}
              onChange={(e) => handleInputChange("shipper", e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Consignee</label>
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
                <Input
                  className={styles.input}
                  value={c.number}
                  placeholder="Container №"
                  disabled={index > 0 ? false : !(c.requiredNumber || false)}
                  onChange={(e) =>
                    handleContainerWagonChange(
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
                <Input
                  className={styles.input}
                  value={c.dropOff}
                  placeholder="Drop-off"
                  disabled={index > 0 ? false : !(c.requiredDropOff || false)}
                  onChange={(e) =>
                    handleContainerWagonChange(
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
            <div key={`wagon-${index}`} className={styles.dynamicRow}>
              <div className={styles.wagon}>
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
                <Input
                  className={styles.input}
                  value={w.number}
                  placeholder="Wagon №"
                  disabled={index > 0 ? false : !(w.requiredNumber || false)}
                  onChange={(e) =>
                    handleContainerWagonChange(
                      "wagons",
                      index,
                      "number",
                      e.target.value,
                    )
                  }
                  onKeyDown={(e) => handleKeyDown(e, "wagons")}
                />
              </div>

              <div className={styles.wagon}>
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
                <Input
                  className={styles.input}
                  value={w.dropOff}
                  placeholder="Drop-off"
                  disabled={index > 0 ? false : !(w.requiredDropOff || false)}
                  onChange={(e) =>
                    handleContainerWagonChange(
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

export default DynamicForm;
