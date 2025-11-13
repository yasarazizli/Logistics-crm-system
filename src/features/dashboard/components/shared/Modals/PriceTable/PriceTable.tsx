import { useState, useEffect, useContext } from "react";
import Select, { StylesConfig, SingleValue } from "react-select";
import styles from "@/components/Modal/Modal.module.scss";
import Modal from "@/components/Modal/Modal.tsx";
import Button from "@/components/Button/Button.tsx";
import Table from "@/features/dashboard/components/shared/Table/Table.tsx";
import { toast } from "react-toastify";
import { errorMessageHandler } from "@/libs/error.ts";
import { createPrice } from "@/features/dashboard/services/CommercialManager/commercial.service.ts";
import { getAllServicesName } from "@/features/dashboard/services/Services&Vendor/all.service.ts";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";

interface Option {
  value: string;
  label: string;
}

interface Service {
  id: number;
  service_name: string;
  note: string;
  time: string;
  location: string;
  transport_mode: string;
  from_id: string;
  to_id: string;
  transport_type: string;
  payload: string;
  total_quantity: string;
}

const customStyles: StylesConfig<Option, false> = {
  control: (provided) => ({
    ...provided,
    border: "1px solid #F5F5F5",
    backgroundColor: "#F5F5F5",
    fontFamily: "Manrope",
    fontSize: "14px",
    fontWeight: 500,
    boxShadow: "none",
    minWidth: "230px",
    color: "#7b7979",
    "&:hover": { border: "1px solid #F5F5F5" },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "18px 10px",
    overflow: "visible",
  }),
  input: (provided) => ({ ...provided, margin: 0, padding: 0, color: "#000" }),
  singleValue: (provided) => ({
    ...provided,
    color: "#000",
    overflow: "visible",
  }),
  placeholder: (provided) => ({ ...provided, color: "rgba(0,0,0,0.48)" }),
  clearIndicator: (provided) => ({
    ...provided,
    cursor: "pointer",
    color: "#000",
    ":hover": { color: "#000" },
  }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: () => ({ display: "none" }),
  option: (provided, state) => ({
    ...provided,
    fontFamily: "Manrope",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    backgroundColor: state.isSelected
      ? "#1D736B"
      : state.isFocused
        ? "#beeabe"
        : "white",
    color: state.isSelected ? "white" : "#000",
    ":active": { backgroundColor: "#1D736B", color: "white" },
  }),
};

const transportTypeOptions: Option[] = [
  { value: "Container", label: "Container" },
  { value: "Bulk", label: "Bulk" },
  { value: "Break_Bulk", label: "Break Bulk" },
];

const PriceTable = ({
  modalClose,
  order_id,
}: {
  modalClose: (isRender: boolean) => void;
  order_id: number | null;
}) => {
  const { setLoader } = useContext(LoaderContext);
  const [service, setService] = useState<Service>({
    id: Date.now(),
    service_name: "",
    time: "",
    note: "",
    location: "",
    transport_mode: "",
    from_id: "",
    to_id: "",
    transport_type: "",
    payload: "",
    total_quantity: "",
  });

  const [ports, setPorts] = useState<Option[]>([]);
  const [stations, setStations] = useState<Option[]>([]);
  const [serviceNames, setServiceNames] = useState<Option[]>([]);

  const handleInputChange = (field: keyof Service, value: string) => {
    setService((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    setLoader(true);
    const fetchServiceNames = async () => {
      try {
        const response = await getAllServicesName();

        if (response.status === 200) {
          const serviceData = response.data.data || response.data;
          console.log("order", order_id);

          if (Array.isArray(serviceData)) {
            const mapped = serviceData.map(
              (serviceItem: { ID: number; name: string }) => ({
                value: serviceItem.name,
                label: serviceItem.name,
              }),
            );
            setServiceNames(mapped);
          }
        }
      } catch (error) {
        console.error("Error fetching service names:", error);
      }
      setLoader(false);
    };

    fetchServiceNames();
  }, []);

  useEffect(() => {
    if (service.transport_mode === "sea") {
      fetch(`${import.meta.env.VITE_API_URL}/geography/get-all-port/`)
        .then((res) => res.json())
        .then((data) =>
          setPorts(
            data.data.map(
              (item: { id: number; name: string; country: string }) => ({
                value: item.id.toString(),
                label: `${item.country} - ${item.name}`,
              }),
            ),
          ),
        )
        .catch(() => setPorts([]));
    } else if (service.transport_mode === "rail") {
      fetch(`${import.meta.env.VITE_API_URL}/geography/get-all-station/`)
        .then((res) => res.json())
        .then((data) =>
          setStations(
            data.map((item: { name: string; value: number }) => ({
              value: item.value.toString(),
              label: item.name,
            })),
          ),
        )
        .catch(() => setStations([]));
    }
  }, [service.transport_mode]);

  const renderSelect = (
    value: string,
    onChange: (option: SingleValue<Option>) => void,
    options: Option[],
    placeholder: string,
  ) => (
    <Select
      styles={customStyles}
      value={value ? options.find((opt) => opt.value === value) || null : null}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      isClearable
      menuPortalTarget={document.body}
      menuPosition="fixed"
      menuShouldBlockScroll
    />
  );

  const handleSend = async () => {
    if (!order_id) {
      toast.error("Order ID is required");
      return;
    }

    setLoader(true);

    const formData = new FormData();

    formData.append("service_name", service.service_name);
    formData.append("location", service.location);
    formData.append("transport_mode", service.transport_mode);
    formData.append("from_id", service.from_id);
    formData.append("to_id", service.to_id);
    formData.append("transport_type", service.transport_type);
    formData.append("payload", service.payload);
    formData.append("total_quantity", service.total_quantity);
    formData.append("time", service.time);
    formData.append("note", service.note);

    const { status, data } = await createPrice(formData, order_id);

    if (status === 200) {
      toast.success("Quotation sent successfully");
      modalClose(true);
    } else {
      toast.error(errorMessageHandler(data));
    }
    setLoader(false);
  };

  return (
    <Modal title="Price quotation by sale" modalClose={() => modalClose(false)}>
      <Table
        headers={[
          { name: "Service" },
          { name: "Location" },
          { name: "Transport mode" },
          { name: "From" },
          { name: "To" },
          { name: "Transport type" },
          { name: "PayLoad" },
          { name: "Total quantity" },
          { name: "Estimated Transportation Time" },
          { name: "Note" },
        ]}
      >
        <tr>
          <td className={styles.cellInput}>
            {renderSelect(
              service.service_name,
              (opt) => handleInputChange("service_name", opt?.value || ""),
              serviceNames,
              "Select Service",
            )}
          </td>
          <td className={styles.cellInput}>
            <input
              value={service.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />
          </td>
          <td className={styles.cellInput}>
            {renderSelect(
              service.transport_mode,
              (opt) => handleInputChange("transport_mode", opt?.value || ""),
              [
                { value: "road", label: "Road" },
                { value: "rail", label: "Rail" },
                { value: "sea", label: "Sea" },
              ],
              "Select...",
            )}
          </td>
          <td className={styles.cellInput}>
            {service.transport_mode === "sea" ? (
              renderSelect(
                service.from_id,
                (opt) => handleInputChange("from_id", opt?.value || ""),
                ports,
                "Select Port",
              )
            ) : service.transport_mode === "rail" ? (
              renderSelect(
                service.from_id,
                (opt) => handleInputChange("from_id", opt?.value || ""),
                stations,
                "Select Station",
              )
            ) : (
              <input
                value={service.from_id}
                onChange={(e) => handleInputChange("from_id", e.target.value)}
              />
            )}
          </td>
          <td className={styles.cellInput}>
            {service.transport_mode === "sea" ? (
              renderSelect(
                service.to_id,
                (opt) => handleInputChange("to_id", opt?.value || ""),
                ports,
                "Select Port",
              )
            ) : service.transport_mode === "rail" ? (
              renderSelect(
                service.to_id,
                (opt) => handleInputChange("to_id", opt?.value || ""),
                stations,
                "Select Station",
              )
            ) : (
              <input
                value={service.to_id}
                onChange={(e) => handleInputChange("to_id", e.target.value)}
              />
            )}
          </td>
          <td className={styles.cellInput}>
            {renderSelect(
              service.transport_type,
              (opt) => handleInputChange("transport_type", opt?.value || ""),
              transportTypeOptions,
              "Select Transport Type",
            )}
          </td>
          <td className={styles.cellInput}>
            <input
              value={service.payload}
              onChange={(e) => handleInputChange("payload", e.target.value)}
            />
          </td>
          <td className={styles.cellInput}>
            <input
              value={service.total_quantity}
              onChange={(e) =>
                handleInputChange("total_quantity", e.target.value)
              }
            />
          </td>
          <td className={styles.cellInput}>
            <input
              value={service.time}
              onChange={(e) => handleInputChange("time", e.target.value)}
            />
          </td>
          <td className={styles.cellInput}>
            <input
              value={service.note}
              onChange={(e) => handleInputChange("note", e.target.value)}
            />
          </td>
        </tr>
      </Table>

      <div className={styles.form__buttons}>
        <Button text="Cancel" type="button" onClick={() => modalClose(false)} />
        <Button text="Send" type="button" onClick={handleSend} />
      </div>
    </Modal>
  );
};

export default PriceTable;
