import { useState, useEffect, useContext, useMemo } from "react";
import Select, { StylesConfig, SingleValue } from "react-select";
import styles from "@/components/Modal/Modal.module.scss";
import Modal from "@/components/Modal/Modal.tsx";
import Button from "@/components/Button/Button.tsx";
import Table from "@/features/dashboard/components/shared/Table/Table.tsx";
import { toast } from "react-toastify";
import { errorMessageHandler } from "@/libs/error.ts";
import {
  ExtraChangeApi,
  OrderIdNo,
} from "@/features/dashboard/services/CommercialManager/commercial.service.ts";
import {
  getAllServicesName,
  getAllVendors,
} from "@/features/dashboard/services/Services&Vendor/all.service.ts";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { DeleteIcon, FileIcon } from "@/assets/icons/shared.vectors.tsx";
import Input from "@/components/Input/Input.tsx";

interface Option {
  value: string;
  label: string;
}

interface OptionType {
  value: number | string;
  label: string;
}

interface VendorType {
  id: number;
  name: string;
}

interface Service {
  index: number;
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
  file: File | null;
  fileName: string;
}

interface OrderData {
  client: string;
  client_id: number;
  contract: string;
  order_no: number;
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

export const customStyle: StylesConfig<OptionType, false> = {
  control: (provided) => ({
    ...provided,
    borderRadius: 6,
    border: "1px solid #E7E7E7",
    backgroundColor: "#F5F5F5",
    height: "55px",
    fontFamily: "Manrope",
    fontSize: "14px",
    fontWeight: 500,
    boxShadow: "none",
    color: "#7b7979",
    "&:hover": {
      border: "1px solid #E7E7E7",
    },
  }),

  valueContainer: (provided) => ({
    ...provided,
    padding: "10px",
    overflow: "hidden",
  }),

  input: (provided) => ({
    ...provided,
    margin: 0,
    padding: 0,
    color: "#000",
  }),

  singleValue: (provided) => ({
    ...provided,
    color: "#000",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
  }),

  placeholder: (provided) => ({
    ...provided,
    color: "rgba(0,0,0,0.48)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }),

  clearIndicator: (provided) => ({
    ...provided,
    cursor: "pointer",
    color: "#000",
    ":hover": {
      color: "#000",
    },
  }),

  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: () => ({ display: "none" }),

  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),

  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  option: (provided, state) => ({
    ...provided,
    fontFamily: "Manrope",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    whiteSpace: "normal",
    wordBreak: "break-word",
    backgroundColor: state.isSelected
      ? "#1D736B"
      : state.isFocused
        ? "#beeabe"
        : "white",
    color: state.isSelected ? "white" : "#000",

    ":active": {
      backgroundColor: "#1D736B",
      color: "white",
    },
  }),
};

const ExtraChangeModal = ({
  modalClose,
}: {
  modalClose: (isRender: boolean) => void;
}) => {
  const { setLoader } = useContext(LoaderContext);
  const [services, setServices] = useState<Service[]>([
    {
      index: 0,
      id: 0,
      service_name: "",
      total_quantity: "0",
      purchase_price_per_ton: "0",
      purchase_price_per_unit: "0",
      unit: "",
      total_purchase_price: "0",
      selling_price: "0",
      total_selling_price: "0",
      vat: "0",
      vat_18: false,
      profit: "0",
      vendor: "",
      description: "",
      file: null,
      fileName: "",
    },
  ]);

  const [serviceNames, setServiceNames] = useState<Option[]>([]);
  const [vendors, setVendors] = useState<VendorType[]>([]);
  const [orderData, setOrderData] = useState<OrderData[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [selectedBank, setSelectedBank] = useState<OptionType | null>(null);

  const [formData, setFormData] = useState({
    date: "",
    client: "",
    contract: "",
  });

  const calculatedValues = useMemo(() => {
    const round = (num: number, decimals = 2) => Number(num.toFixed(decimals));
    let totalPurchasePrice = 0;
    let totalSellingPrice = 0;
    let totalVAT = 0;

    const calculatedServices = services.map((service) => {
      const totalQuantity = parseFloat(service.total_quantity) || 0;
      const purchasePricePerTon =
        parseFloat(service.purchase_price_per_ton) || 0;
      const purchasePricePerUnit =
        parseFloat(service.purchase_price_per_unit) || 0;
      const sellingPrice = parseFloat(service.selling_price) || 0;
      const unitType = service.unit;

      let totalPurchase = 0;
      let totalSelling = 0;

      if (unitType === "ton") {
        totalPurchase = round(totalQuantity * purchasePricePerTon);
      } else if (unitType === "unit") {
        totalPurchase = round(totalQuantity * purchasePricePerUnit);
      }

      if (unitType === "ton" || unitType === "unit") {
        totalSelling = round(totalQuantity * sellingPrice);
      }

      const vatAmount = service.vat_18 ? round(totalSelling * 0.18) : 0;

      totalPurchasePrice += totalPurchase;
      totalSellingPrice += totalSelling;
      totalVAT += vatAmount;

      return {
        ...service,
        total_purchase_price: totalPurchase.toFixed(2),
        total_selling_price: totalSelling.toFixed(2),
        vat: vatAmount.toFixed(2),
      };
    });

    const totalAmount = totalSellingPrice + totalVAT;

    return {
      services: calculatedServices,
      summary: {
        totalPurchase: round(totalPurchasePrice),
        totalSelling: round(totalSellingPrice),
        totalVAT: round(totalVAT),
        totalAmount: round(totalAmount),
      },
    };
  }, [services]);

  const displayServices = calculatedValues.services;

  const handleServiceInputChange = (
    id: number,
    field: keyof Service,
    value: string | boolean | File,
  ) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, [field]: value } : service,
      ),
    );
  };

  const handleFileChange = (
    id: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setServices((prev) =>
        prev.map((service) =>
          service.id === id
            ? {
                ...service,
                file: file,
                fileName: file.name,
              }
            : service,
        ),
      );
    }
  };

  const removeFile = (id: number) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id
          ? {
              ...service,
              file: null,
              fileName: "",
            }
          : service,
      ),
    );
  };

  const addNewRow = () => {
    const newId =
      services.length > 0 ? Math.max(...services.map((s) => s.id)) + 1 : 1;
    setServices([
      ...services,
      {
        index: services.length,
        id: newId,
        service_name: "",
        total_quantity: "0",
        purchase_price_per_ton: "0",
        purchase_price_per_unit: "0",
        unit: "",
        total_purchase_price: "0",
        selling_price: "0",
        total_selling_price: "0",
        vat: "0",
        vat_18: false,
        profit: "0",
        vendor: "",
        description: "",
        file: null,
        fileName: "",
      },
    ]);
  };

  const deleteRow = (id: number) => {
    if (services.length > 1) {
      setServices(services.filter((service) => service.id !== id));
    } else {
      toast.warning("At least one row must remain");
    }
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

    const fetchOrderData = async () => {
      const { data, status } = await OrderIdNo();
      if (status === 200) {
        setOrderData(data);
      }
    };
    fetchOrderData();
  }, []);

  const vendorOptions: Option[] = vendors.map((vendor) => ({
    value: vendor.id.toString(),
    label: vendor.name,
  }));

  const orderOptions: OptionType[] = orderData.map((order) => ({
    value: order.order_no,
    label: `Order ${order.order_no}`,
  }));

  const handleOrderSelect = (selectedOption: SingleValue<OptionType>) => {
    if (selectedOption) {
      const order = orderData.find(
        (o) => o.order_no.toString() === selectedOption.value.toString(),
      );
      if (order) {
        setSelectedOrder(order);
        setFormData({
          ...formData,
          client: order.client,
          contract: order.contract || "",
        });
      }
    } else {
      setSelectedOrder(null);
      setFormData({
        ...formData,
        client: "",
        contract: "",
      });
    }
  };

  const handleFormInputChange = (
    field: keyof typeof formData,
    value: string,
  ) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

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

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("date", formData.date);
      formDataToSend.append(
        "order_id",
        selectedOrder?.order_no?.toString() || "",
      );
      formDataToSend.append("client", formData.client);
      formDataToSend.append("contract", formData.contract);
      formDataToSend.append("bank", selectedBank?.value?.toString() || "");

      // calculatedValues.services istifadə edin
      const servicesData = calculatedValues.services.map((service) => {
        const parseOrZero = (value: string | undefined | null): number => {
          if (!value || value.trim() === "") return 0;
          const parsed = parseFloat(value);
          return isNaN(parsed) ? 0 : parsed;
        };

        const parseVendorId = (vendorValue: string): number => {
          if (!vendorValue || vendorValue.trim() === "") return 0;
          const parsed = parseFloat(vendorValue);
          return isNaN(parsed) ? 0 : parsed;
        };

        return {
          index: service.id + 1,
          service_name: service.service_name,
          total_quantity: parseOrZero(service.total_quantity),
          purchase_price_per_ton: parseOrZero(service.purchase_price_per_ton),
          purchase_price_per_unit: parseOrZero(service.purchase_price_per_unit),
          unit: service.unit,
          total_purchase_price: parseOrZero(service.total_purchase_price),
          selling_price: parseOrZero(service.selling_price),
          total_selling_price: parseOrZero(service.total_selling_price),
          vat: parseOrZero(service.vat),
          vat_18: service.vat_18,
          profit: parseOrZero(service.profit),
          // Vendor ID-ni number-a çeviririk
          vendor: parseVendorId(service.vendor),
          description: service.description,
        };
      });

      formDataToSend.append("services", JSON.stringify(servicesData));

      services.forEach((service, index) => {
        if (service.file) {
          formDataToSend.append(`file_${index + 1}`, service.file);
        }
      });

      console.log("Sending data:", servicesData);

      const { status, data } = await ExtraChangeApi(formDataToSend);

      if (status === 200) {
        toast.success("Quotation sent successfully");
        modalClose(true);
      } else {
        toast.error(errorMessageHandler(data));
      }
    } catch (error) {
      toast.error("Error sending quotation");
      console.error(error);
    }

    setLoader(false);
  };

  const bank = [
    "ABB (RUB)",
    "ABB (USD)",
    "ABB (AZN)",
    "Pasha Bank (USD)",
    "Pasha Bank (RUB)",
    "Pasha Bank (EUR)",
    "Pasha Bank (AZN)",
  ];

  const bankOptions = bank.map((b) => ({
    value: b,
    label: b,
  }));

  return (
    <Modal title="Extra Cost" modalClose={() => modalClose(false)}>
      <div className={styles.form}>
        <div className={styles.form__inputs}>
          <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
            <div className={styles.selectWrapper}>
              <Input
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => handleFormInputChange("date", e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.selectWrapper}>
              <label className={styles.label}>Order ID</label>
              <Select
                styles={customStyle}
                options={orderOptions}
                onChange={handleOrderSelect}
                placeholder="Order ID"
                isSearchable
                isClearable
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 13,
              marginBottom: 20,
            }}
          >
            <div className={styles.selectWrapper}>
              <Input
                type="text"
                label="Client"
                value={formData.client}
                onChange={(e) =>
                  handleFormInputChange("client", e.target.value)
                }
                className={styles.input}
                placeholder="Client"
                readOnly={!!selectedOrder}
                style={{
                  backgroundColor: selectedOrder ? "#f0f0f0" : "#F5F5F5",
                  cursor: selectedOrder ? "not-allowed" : "text",
                }}
              />
            </div>
            <div className={styles.selectWrapper}>
              <label className={styles.label}>Bank rekviziti</label>
              <Select
                styles={customStyle}
                options={bankOptions}
                value={selectedBank}
                onChange={setSelectedBank}
                placeholder="Bank rekviziti"
                isSearchable
                isClearable
              />
            </div>
            <div className={styles.selectWrapper}>
              <Input
                type="text"
                value={formData.contract}
                label="Contract"
                onChange={(e) =>
                  handleFormInputChange("contract", e.target.value)
                }
                className={styles.input}
                placeholder="Contract"
                readOnly={!!selectedOrder}
                style={{
                  backgroundColor: selectedOrder ? "#f0f0f0" : "#F5F5F5",
                  cursor: selectedOrder ? "not-allowed" : "text",
                }}
              />
            </div>
          </div>
        </div>

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
            { name: "File" },
            { name: "Actions" },
          ]}
        >
          {displayServices.map((service) => (
            <tr key={service.id}>
              <td className={styles.cellInput}>
                {renderSelect(
                  service.service_name,
                  (opt) =>
                    handleServiceInputChange(
                      service.id,
                      "service_name",
                      opt?.value || "",
                    ),
                  serviceNames,
                  "Select Service",
                  true,
                )}
              </td>
              <td className={styles.cellInput}>
                <input
                  value={service.total_quantity}
                  onChange={(e) =>
                    handleServiceInputChange(
                      service.id,
                      "total_quantity",
                      e.target.value,
                    )
                  }
                />
              </td>
              <td className={styles.cellInput}>
                <input
                  value={service.purchase_price_per_ton}
                  onChange={(e) =>
                    handleServiceInputChange(
                      service.id,
                      "purchase_price_per_ton",
                      e.target.value,
                    )
                  }
                />
              </td>
              <td className={styles.cellInput}>
                <input
                  value={service.purchase_price_per_unit}
                  onChange={(e) =>
                    handleServiceInputChange(
                      service.id,
                      "purchase_price_per_unit",
                      e.target.value,
                    )
                  }
                />
              </td>
              <td className={styles.cellInput}>
                {renderSelect(
                  service.unit,
                  (opt) =>
                    handleServiceInputChange(
                      service.id,
                      "unit",
                      opt?.value || "",
                    ),
                  [
                    { value: "unit", label: "Unit" },
                    { value: "ton", label: "Ton" },
                  ],
                  "Select Unit",
                  true,
                )}
              </td>
              <td className={styles.cellInput}>
                <input value={service.total_purchase_price} readOnly />
              </td>
              <td className={styles.cellInput}>
                <input
                  value={service.selling_price}
                  onChange={(e) =>
                    handleServiceInputChange(
                      service.id,
                      "selling_price",
                      e.target.value,
                    )
                  }
                />
              </td>
              <td className={styles.cellInput}>
                <input value={service.total_selling_price} readOnly />
              </td>
              <td className={styles.cellInput}>
                <input value={service.vat} readOnly />
              </td>
              <td className={styles.cellInput}>
                <input
                  type="checkbox"
                  checked={service.vat_18}
                  style={{ cursor: "pointer" }}
                  onChange={(e) =>
                    handleServiceInputChange(
                      service.id,
                      "vat_18",
                      e.target.checked,
                    )
                  }
                />
              </td>
              <td className={styles.cellInput}>
                <input
                  value={service.profit}
                  onChange={(e) =>
                    handleServiceInputChange(
                      service.id,
                      "profit",
                      e.target.value,
                    )
                  }
                />
              </td>
              <td className={styles.cellInput}>
                {renderSelect(
                  service.vendor,
                  (opt) =>
                    handleServiceInputChange(
                      service.id,
                      "vendor",
                      opt?.value || "",
                    ),
                  vendorOptions,
                  "Select Vendor",
                  true,
                )}
              </td>
              <td className={styles.cellInput}>
                <input
                  value={service.description}
                  onChange={(e) =>
                    handleServiceInputChange(
                      service.id,
                      "description",
                      e.target.value,
                    )
                  }
                />
              </td>
              <td className={styles.cellInput}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <label
                    htmlFor={`file-upload-${service.id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                      padding: "8px 12px",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                  >
                    <FileIcon />
                    Upload
                  </label>
                  <input
                    id={`file-upload-${service.id}`}
                    type="file"
                    onChange={(e) => handleFileChange(service.id, e)}
                    style={{ display: "none" }}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  />
                  {service.file && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <span style={{ fontSize: "12px" }}>
                        {service.fileName}
                      </span>
                      <button
                        onClick={() => removeFile(service.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#ff0000",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </td>
              <td className={styles.cellInput}>
                <div className={styles.icon}>
                  <div
                    className={styles.icon__1}
                    onClick={() => deleteRow(service.id)}
                  >
                    <DeleteIcon />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </Table>

        <div style={{ marginTop: "10px", position: "absolute" }}>
          <Button
            text="Add Column"
            type="button"
            onClick={addNewRow}
            viewType="green__light"
          />
        </div>

        <div className={styles.form__buttons}>
          <Button
            text="Cancel"
            type="button"
            onClick={() => modalClose(false)}
            viewType="red"
          />
          <Button text="Send" type="button" onClick={handleSend} />
        </div>
      </div>
    </Modal>
  );
};

export default ExtraChangeModal;
