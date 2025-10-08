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
  isRegister?: boolean;
}

const DynamicForm = forwardRef<DynamicFormRef, DynamicFormProps>(
  ({ onFormDataChange, isRegister = false }, ref) => {
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
      field: "number" | "dropOff",
      value: string,
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

          {!isRegister ? (
            <>
              <div className={styles.formGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={form.notifyParty}
                    onChange={() =>
                      setForm((prev) => ({
                        ...prev,
                        notifyParty: !prev.notifyParty,
                      }))
                    }
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
                    onChange={() =>
                      setForm((prev) => ({ ...prev, terminal: !prev.terminal }))
                    }
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
                    onChange={() =>
                      setForm((prev) => ({
                        ...prev,
                        containerOwner: !prev.containerOwner,
                      }))
                    }
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
                    onChange={() =>
                      setForm((prev) => ({
                        ...prev,
                        wagonOwner: !prev.wagonOwner,
                      }))
                    }
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
            </>
          ) : (
            <>
              <div className={styles.formGroup}>
                <label>Notify Party</label>
                <Input
                  placeholder="Notify Party"
                  value={
                    form.notifyPartyValue === null
                      ? ""
                      : form.notifyPartyValue.toString()
                  }
                  onChange={(e) => handleNotifyPartyChange(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Terminal</label>
                <Input
                  placeholder="Terminal"
                  className={styles.input}
                  value={form.terminalValue}
                  onChange={(e) =>
                    handleInputChange("terminalValue", e.target.value)
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
                    handleInputChange("containerOwnerValue", e.target.value)
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
                    handleInputChange("wagonOwnerValue", e.target.value)
                  }
                />
              </div>
            </>
          )}
        </div>

        <div className={styles.section}>
          {form.containers.map((c, index) => (
            <div key={`container-${index}`} className={styles.dynamicRow}>
              <div className={styles.wagon}>
                <label>Container {index > 0 && `${index + 1}`}</label>
                <Input
                  className={styles.input}
                  value={c.number}
                  placeholder="Container №"
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
                <label>Drop-off {index > 0 && `${index + 1}`}</label>
                <Input
                  className={styles.input}
                  value={c.dropOff}
                  placeholder="Drop-off"
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
                <label>Wagon {index > 0 && `${index + 1}`}</label>
                <Input
                  className={styles.input}
                  value={w.number}
                  placeholder="Wagon №"
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
                <label>Drop-off {index > 0 && `${index + 1}`}</label>
                <Input
                  className={styles.input}
                  value={w.dropOff}
                  placeholder="Drop-off"
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
