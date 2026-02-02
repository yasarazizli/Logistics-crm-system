import { useState, useEffect, useContext } from "react";
import Select, { StylesConfig, SingleValue } from "react-select";
import styles from "@/components/Modal/Modal.module.scss";
import Modal from "@/components/Modal/Modal.tsx";
import Button from "@/components/Button/Button.tsx";
import Table from "@/features/dashboard/components/shared/Table/Table.tsx";
import { toast } from "react-toastify";
import { errorMessageHandler } from "@/libs/error.ts";
import { createPrice } from "@/features/dashboard/services/CommercialManager/commercial.service.ts";
import {
  getAllServicesName,
  getAllVendors,
} from "@/features/dashboard/services/Services&Vendor/all.service.ts";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";

interface Option {
  value: string;
  label: string;
}

interface VendorType {
  id: number;
  name: string;
}

interface Service {
  id: number;
  service_name: string;
  total_quantity: string;
  purchase_price_per_ton: string;
  purchase_price_per_unit: string;
  unit: string;
  total_purchase_price: string;
  selling_price: string;
  total_selling_price: string;
  vat: string;
  vat_18: boolean;
  profit: string;
  vendor: string;
  description: string;
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
    minWidth: "240px",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    color: "#7b7979",
    "&:hover": { border: "1px solid #F5F5F5" },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "18px 10px",
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

const ExtraChangeModal = ({
  modalClose,
}: {
  modalClose: (isRender: boolean) => void;
}) => {
  const { setLoader } = useContext(LoaderContext);
  const [service, setService] = useState<Service>({
    id: Date.now(),
    service_name: "",
    total_quantity: "",
    purchase_price_per_ton: "",
    purchase_price_per_unit: "",
    unit: "",
    total_purchase_price: "",
    selling_price: "",
    total_selling_price: "",
    vat: "",
    vat_18: false,
    profit: "",
    vendor: "",
    description: "",
  });

  const [serviceNames, setServiceNames] = useState<Option[]>([]);
  const [vendors, setVendors] = useState<VendorType[]>([]);

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

    const fetchVendors = async () => {
      const { data, status } = await getAllVendors();
      if (status === 200) {
        setVendors(data);
      }
    };
    fetchVendors();
  }, []);

  const vendorOptions: Option[] = vendors.map((vendor) => ({
    value: vendor.id.toString(),
    label: vendor.name,
  }));

  const renderSelect = (
    value: string,
    onChange: (option: SingleValue<Option>) => void,
    options: Option[],
    placeholder: string,
    required: boolean,
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
      required={required}
    />
  );

  const handleSend = async () => {
    setLoader(true);

    const formData = new FormData();

    formData.append("service_name", service.service_name);
    formData.append("total_quantity", service.total_quantity);
    formData.append("purchase_price_per_ton", service.purchase_price_per_ton);
    formData.append("purchase_price_per_unit", service.purchase_price_per_unit);
    formData.append("unit", service.unit);
    formData.append("total_purchase_price", service.total_purchase_price);
    formData.append("selling_price", service.selling_price);
    formData.append("total_selling_price", service.total_selling_price);
    formData.append("vat", service.vat);
    formData.append("vat_18", service.vat_18.toString());
    formData.append("profit", service.profit);
    formData.append("vendor", service.vendor);
    formData.append("description", service.description);

    const { status, data } = await createPrice(formData, 2);

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
          { name: "Total Quantity" },
          { name: "Purchase price per ton" },
          { name: "Purchase price per unit" },
          { name: "Unit" },
          { name: "Total Purchase Price" },
          { name: "Selling price" },
          { name: "Total Selling Price" },
          { name: "VAT" },
          { name: "VAT (18%)" },
          { name: "Profit" },
          { name: "Vendor" },
          { name: "Description" },
        ]}
      >
        <tr>
          <td className={styles.cellInput}>
            {renderSelect(
              service.service_name,
              (opt) => handleInputChange("service_name", opt?.value || ""),
              serviceNames,
              "Select Service",
              true,
            )}
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
              value={service.purchase_price_per_ton}
              onChange={(e) =>
                handleInputChange("purchase_price_per_ton", e.target.value)
              }
            />
          </td>
          <td className={styles.cellInput}>
            <input
              value={service.purchase_price_per_unit}
              onChange={(e) =>
                handleInputChange("purchase_price_per_unit", e.target.value)
              }
            />
          </td>
          <td className={styles.cellInput}>
            {renderSelect(
              service.unit,
              (opt) => handleInputChange("unit", opt?.value || ""),
              [
                { value: "unit", label: "Unit" },
                { value: "ton", label: "Ton" },
              ],
              "Select Unit",
              true,
            )}
          </td>
          <td className={styles.cellInput}>
            <input
              value={service.total_purchase_price}
              onChange={(e) =>
                handleInputChange("total_purchase_price", e.target.value)
              }
            />
          </td>
          <td className={styles.cellInput}>
            <input
              value={service.selling_price}
              onChange={(e) =>
                handleInputChange("selling_price", e.target.value)
              }
            />
          </td>
          <td className={styles.cellInput}>
            <input
              value={service.total_selling_price}
              onChange={(e) =>
                handleInputChange("total_selling_price", e.target.value)
              }
            />
          </td>
          <td className={styles.cellInput}>
            <input
              value={service.vat}
              onChange={(e) => handleInputChange("vat", e.target.value)}
            />
          </td>

          <td className={styles.cellInput}>
            <input
              type="checkbox"
              checked={service.vat_18}
              onChange={(e) =>
                setService((prev) => ({ ...prev, vat_18: e.target.checked }))
              }
            />
          </td>

          <td className={styles.cellInput}>
            <input
              value={service.profit}
              onChange={(e) => handleInputChange("profit", e.target.value)}
            />
          </td>
          <td className={styles.cellInput}>
            {renderSelect(
              service.vendor,
              (opt) => handleInputChange("vendor", opt?.value || ""),
              vendorOptions,
              "Select Vendor",
              true,
            )}
          </td>
          <td className={styles.cellInput}>
            <input
              value={service.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
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

export default ExtraChangeModal;
