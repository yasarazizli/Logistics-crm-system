import { useState, useEffect, useCallback, useMemo } from "react";
import styles from "./RowTable.module.scss";
import Select, { StylesConfig } from "react-select";
import { DeleteIcon, SharedIcon } from "@/assets/icons/shared.vectors.tsx";
import CreateServicesTable from "@/features/dashboard/components/shared/Modals/ServicesTable/CreateServicesTable.tsx";
import PriceTable from "@/features/dashboard/components/shared/Modals/PriceTable/PriceTable.tsx";
import DeleteColumn from "@/features/dashboard/components/shared/Modals/DeleteColumn/DeleteColumn.tsx";

interface OptionType {
  value: string;
  label: string;
}

interface Service {
  id: number;
  country: string;
  location: string;
  vendor: string;
  service: string;
  transport_mode: string;
  hs_code: string;
  from: string;
  to: string;
  transport_type: string;
  purchase_price_ton: number;
  purchase_price_unit: number;
}

export interface TableRowData {
  serviceName?: string;
  location: string;
  transportMode: string;
  from: string;
  to: string;
  transportType: string;
  packagingType: string;
  packagingSize: string;
  packagingPackage: string;
  netWeight: string;
  grossWeight: string;
  width: string;
  length: string;
  height: string;
  payload: string;
  totalQuantity: string;
  estimatedTime: string;
  purchasePricePerTon: string;
  purchasePricePerUnit: string;
  unit: string;
  totalPurchasePrice: string;
  sellingPrice: string;
  totalPrice: string;
  vatAmount: string;
  vat18: boolean;
  vendor: string;
  note: string;
  profit: string;

  [key: string]: string | number | boolean | undefined;
}

export interface TableSummaryData {
  amount: string;
  vat: string;
  totalAmount: string;
  perTonPrice: string;
  transportationTime: string;
}

export interface CompleteTableData {
  rows: TableRowData[];
  summary: TableSummaryData;
}

const staticRows = [
  "Name of Service",
  "Location",
  "Transport mode",
  "From",
  "To",
  "Transport type",
  "Packaging Type",
  "Net weight ton",
  "Gross weight ton",
  "Width (Meter)",
  "Length (Meter)",
  "Height (Meter)",
  "PayLoad",
  "Total quantity",
  "Estimated Transportation Time",
  "Purchase price per ton",
  "Purchase price per unit",
  "Unit",
  "Total purchase price",
  "Selling price",
  "Total price",
  "VAT amount",
  "VAT 18%",
  "Vendor",
  "Price quotation",
  "Note",
  "Profit",
  "Delete",
];

const unitOptions: OptionType[] = [
  { value: "ton", label: "Ton" },
  { value: "unit", label: "Unit" },
];

const packagingOptions1: OptionType[] = [
  { value: "Container", label: "Container" },
  { value: "Break_Bulk", label: "Break Bulk" },
  { value: "Bulk", label: "Bulk" },
  { value: "Oversize_Cargo", label: "Oversize Cargo" },
];

const packagingOptions2: OptionType[] = [
  { value: "20", label: "20" },
  { value: "40", label: "40" },
  { value: "45", label: "45" },
  { value: "other", label: "Other" },
];

const getTypeOptions = (type: string): OptionType[] => {
  if (type === "Break_Bulk") {
    return [
      { value: "Bag", label: "Bag" },
      { value: "Big Bag", label: "Big Bag" },
      { value: "Box/Crate", label: "Box/Crate" },
      { value: "Pallet", label: "Pallet" },
      { value: "Drums/Barrel", label: "Drums/Barrel" },
      { value: "IBC Tank", label: "IBC Tank" },
      { value: "Other", label: "Other" },
    ];
  } else if (type === "Bulk") {
    return [
      { value: "Bulk Dry", label: "Bulk Dry" },
      { value: "Bulk Liquid", label: "Bulk Liquid" },
      { value: "Other", label: "Other" },
    ];
  } else if (type === "Oversize_Cargo") {
    return [];
  } else if (type === "Container") {
    return [
      { value: "Standart DC", label: "Standart DC" },
      { value: "Standart HC", label: "Standart HC" },
      { value: "Reefer DC", label: "Reefer DC" },
      { value: "Reefer HC", label: "Reefer HC" },
      { value: "Open Top", label: "Open Top" },
      { value: "Flatrack", label: "Flatrack" },
      { value: "Bulk", label: "Bulk" },
      { value: "Flexi Tank", label: "Flexi Tank" },
      { value: "Other", label: "Other" },
    ];
  } else {
    return [];
  }
};

const visibilityRules: Record<string, string[]> = {
  PayLoad: ["admin", "commercial_manager", "commercial_specialist"],
  "Total quantity": ["admin", "commercial_manager", "commercial_specialist"],
};

const disabledCells = ["3-0", "18-0", "19-0"];

interface TableProps {
  role?: string;
  onServiceClick?: (service: string) => void;
  onLocationClick?: (location: string) => void;
  onTransportModeClick?: (mode: string) => void;
  onFromClick?: (from: string) => void;
  onToClick?: (to: string) => void;
  onTransportTypeClick?: (type: string) => void;
  onVendorClick?: (vendor: string) => void;
  index: number;
  rows: TableRowData[];
  summary: TableSummaryData;
  onTableDataChange: (index: number, data: CompleteTableData) => void;
}

export default function Table({
  index,
  role = "admin",
  onLocationClick,
  onTransportModeClick,
  onFromClick,
  onToClick,
  onTransportTypeClick,
  onVendorClick,
  onTableDataChange,
}: TableProps) {
  const [columns, setColumns] = useState<number[]>([0]);
  const [selectedTransportType, setSelectedTransportType] = useState<
    (OptionType | null)[]
  >(Array(columns.length).fill(null));

  const [selectedTransportMode, setSelectedTransportMode] = useState<
    (OptionType | null)[]
  >(Array(columns.length).fill(null));

  const [selectedService, setSelectedService] = useState<(OptionType | null)[]>(
    Array(columns.length).fill(null),
  );

  const [selectedVendor, setSelectedVendor] = useState<(OptionType | null)[]>(
    Array(columns.length).fill(null),
  );

  const [selectedFrom, setSelectedFrom] = useState<(OptionType | null)[]>(
    Array(columns.length).fill(null),
  );

  const [selectedTo, setSelectedTo] = useState<(OptionType | null)[]>(
    Array(columns.length).fill(null),
  );

  const [selectedUnit, setSelectedUnit] = useState<(OptionType | null)[]>(
    Array(columns.length).fill(null),
  );

  const [selectedPackaging, setSelectedPackaging] = useState<
    (OptionType | null)[][][]
  >(
    Array(staticRows.length).fill(
      Array(columns.length).fill(Array(3).fill(null)),
    ),
  );

  const [textValues, setTextValues] = useState<{ [key: string]: string }>({});
  const [calculatedValues, setCalculatedValues] = useState<{
    [key: string]: number;
  }>({});

  const [summaryData, setSummaryData] = useState<TableSummaryData>({
    amount: "0$",
    vat: "0$",
    totalAmount: "0$",
    perTonPrice: "0$",
    transportationTime: "0 days",
  });

  useEffect(() => {
    const savedCols = localStorage.getItem("table_columns");
    if (savedCols) {
      try {
        const parsed = JSON.parse(savedCols);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setColumns(parsed);
          setSelectedTransportType(Array(parsed.length).fill(null));
          setSelectedTransportMode(Array(parsed.length).fill(null));
          setSelectedService(Array(parsed.length).fill(null));
          setSelectedVendor(Array(parsed.length).fill(null));
          setSelectedFrom(Array(parsed.length).fill(null));
          setSelectedTo(Array(parsed.length).fill(null));
          setSelectedUnit(Array(parsed.length).fill(null));
          setSelectedPackaging(
            Array(staticRows.length)
              .fill(0)
              .map(() => Array(parsed.length).fill(Array(3).fill(null))),
          );
        }
      } catch {
        setColumns([0]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("table_columns", JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    const newCalculatedValues: { [key: string]: number } = {};
    let totalAmount = 0;
    let totalVAT = 0;
    let totalPurchasePrice = 0;
    let totalEstimatedTime = 0;

    columns.forEach((colIndex) => {
      const payload = parseFloat(textValues[`PayLoad-${colIndex}`] || "0");

      const sellingPrice = parseFloat(
        textValues[`Selling price-${colIndex}`] || "0",
      );

      const purchasePricePerTon = parseFloat(
        textValues[`Purchase price per ton-${colIndex}`] || "0",
      );
      const purchasePricePerUnit = parseFloat(
        textValues[`Purchase price per unit-${colIndex}`] || "0",
      );

      const estimatedTime = parseFloat(
        textValues[`Estimated Transportation Time-${colIndex}`] || "0",
      );

      const unitType = selectedUnit[colIndex]?.value;

      const totalPrice = payload * sellingPrice;
      newCalculatedValues[`Total price-${colIndex}`] = totalPrice;

      const isVatChecked = textValues[`VAT 18%-${colIndex}`] === "true";
      const vatAmount = isVatChecked ? totalPrice * 0.18 : 0;
      newCalculatedValues[`VAT amount-${colIndex}`] = vatAmount;

      let totalPurchase = 0;
      if (unitType === "ton") {
        totalPurchase = payload * purchasePricePerTon;
      } else if (unitType === "unit") {
        totalPurchase = payload * purchasePricePerUnit;
      }
      newCalculatedValues[`Total purchase price-${colIndex}`] = totalPurchase;

      totalAmount += totalPrice;
      totalVAT += vatAmount;
      totalPurchasePrice += totalPurchase;
      totalEstimatedTime += estimatedTime;
    });

    setCalculatedValues(newCalculatedValues);

    setSummaryData({
      amount: `${totalAmount.toFixed(2)}$`,
      vat: `${totalVAT.toFixed(2)}$`,
      totalAmount: `${(totalAmount + totalVAT).toFixed(2)}$`,
      perTonPrice: `${totalPurchasePrice.toFixed(2)}$`,
      transportationTime: `${totalEstimatedTime} days`,
    });
  }, [textValues, selectedUnit, columns]);

  const convertTableToJSON = useCallback((): CompleteTableData => {
    const rows: TableRowData[] = columns.map((colIndex) => {
      const unitType = selectedUnit[colIndex]?.value || "";

      return {
        serviceName: selectedService[colIndex]?.value || "",
        location: textValues[`Location-${colIndex}`] || "",
        transportMode: selectedTransportMode[colIndex]?.label || "",
        from: selectedFrom[colIndex]?.label || "",
        to: selectedTo[colIndex]?.label || "",
        transportType: selectedTransportType[colIndex]?.label || "",
        packagingType: selectedPackaging[6]?.[colIndex]?.[0]?.label || "",
        packagingSize: selectedPackaging[6]?.[colIndex]?.[1]?.label || "",
        packagingPackage: selectedPackaging[6]?.[colIndex]?.[2]?.label || "",
        netWeight: textValues[`Net weight ton-${colIndex}`] || "",
        grossWeight: textValues[`Gross weight ton-${colIndex}`] || "",
        width: textValues[`Width (Meter)-${colIndex}`] || "",
        length: textValues[`Length (Meter)-${colIndex}`] || "",
        height: textValues[`Height (Meter)-${colIndex}`] || "",
        payload: textValues[`PayLoad-${colIndex}`] || "",
        totalQuantity: textValues[`Total quantity-${colIndex}`] || "",
        estimatedTime:
          textValues[`Estimated Transportation Time-${colIndex}`] || "",
        purchasePricePerTon:
          textValues[`Purchase price per ton-${colIndex}`] || "",
        purchasePricePerUnit:
          textValues[`Purchase price per unit-${colIndex}`] || "",
        unit: unitType,
        totalPurchasePrice:
          calculatedValues[`Total purchase price-${colIndex}`]?.toFixed(2) ||
          "0",
        sellingPrice: textValues[`Selling price-${colIndex}`] || "",
        totalPrice:
          calculatedValues[`Total price-${colIndex}`]?.toFixed(2) || "0",
        vatAmount:
          calculatedValues[`VAT amount-${colIndex}`]?.toFixed(2) || "0",
        vat18: textValues[`VAT 18%-${colIndex}`] === "true",
        vendor: selectedVendor[colIndex]?.label || "",
        note: textValues[`Note-${colIndex}`] || "",
        profit: textValues[`Profit-${colIndex}`] || "0",
      };
    });

    return {
      rows,
      summary: summaryData,
    };
  }, [
    columns,
    selectedUnit,
    selectedService,
    textValues,
    selectedTransportMode,
    selectedFrom,
    selectedTo,
    selectedTransportType,
    selectedPackaging,
    selectedVendor,
    calculatedValues,
    summaryData,
  ]);

  const tableData = useMemo(() => convertTableToJSON(), [convertTableToJSON]);

  useEffect(() => {
    if (onTableDataChange) {
      onTableDataChange(index, tableData);
    }
  }, [tableData, onTableDataChange, index]);

  const handleTextChange = (
    rowName: string,
    colIndex: number,
    value: string,
  ) => {
    setTextValues((prev) => ({
      ...prev,
      [`${rowName}-${colIndex}`]: value,
    }));
  };

  const handlePackagingChange = (
    rowIndex: number,
    colIndex: number,
    selectIndex: number,
    option: OptionType | null,
  ) => {
    setSelectedPackaging((prev) => {
      const newPackaging = [...prev];
      newPackaging[rowIndex] = [...newPackaging[rowIndex]];
      newPackaging[rowIndex][colIndex] = [...newPackaging[rowIndex][colIndex]];
      newPackaging[rowIndex][colIndex][selectIndex] = option;

      if (selectIndex === 0 && option) {
        newPackaging[rowIndex][colIndex][2] = null;
      }

      return newPackaging;
    });
  };

  const handleUnitChange = (colIndex: number, option: OptionType | null) => {
    setSelectedUnit((prev) => {
      const newSelectedUnit = [...prev];
      newSelectedUnit[colIndex] = option;
      return newSelectedUnit;
    });
  };

  const addColumn = () => {
    setColumns((prev) => [...prev, prev.length]);
    setSelectedTransportType((prev) => [...prev, null]);
    setSelectedTransportMode((prev) => [...prev, null]);
    setSelectedService((prev) => [...prev, null]);
    setSelectedVendor((prev) => [...prev, null]);
    setSelectedFrom((prev) => [...prev, null]);
    setSelectedTo((prev) => [...prev, null]);
    setSelectedUnit((prev) => [...prev, null]);
    setSelectedPackaging((prev) =>
      prev.map((row) => [...row, Array(3).fill(null)]),
    );
  };

  const deleteColumn = (colIndex: number) => {
    setModal({ type: "delete", colIndex });
  };

  const confirmDeleteColumn = (colIndex: number) => {
    setColumns((prev) => prev.filter((_, i) => i !== colIndex));

    setSelectedTransportType((prev) => prev.filter((_, i) => i !== colIndex));
    setSelectedTransportMode((prev) => prev.filter((_, i) => i !== colIndex));
    setSelectedService((prev) => prev.filter((_, i) => i !== colIndex));
    setSelectedVendor((prev) => prev.filter((_, i) => i !== colIndex));
    setSelectedFrom((prev) => prev.filter((_, i) => i !== colIndex));
    setSelectedTo((prev) => prev.filter((_, i) => i !== colIndex));
    setSelectedUnit((prev) => prev.filter((_, i) => i !== colIndex));
    setSelectedPackaging((prev) =>
      prev.map((row) => row.filter((_, i) => i !== colIndex)),
    );

    setTextValues((prev) => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach((key) => {
        if (key.endsWith(`-${colIndex}`)) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setCalculatedValues((prev) => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach((key) => {
        if (key.endsWith(`-${colIndex}`)) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setModal(null);
  };

  const getPackagingStyles = (
    placeholder?: string,
  ): StylesConfig<OptionType, false> => ({
    control: (provided) => ({
      ...provided,
      cursor: "pointer",
      borderRadius: "0px",
      border: "none",
      borderBottom:
        placeholder === "Package" || placeholder === "Select Unit"
          ? "none"
          : "0.5px solid #b5b5b5",
      backgroundColor: "#fafafa",
      height: "100%",
      minHeight: "52px",
      fontFamily: "Manrope",
      fontSize: "14px",
      fontWeight: 500,
      boxShadow: "none",
      color: "#000",
      padding: "0px 20px",

      "&:hover": {
        borderBottom:
          placeholder === "Package" || placeholder === "Select Unit"
            ? "none"
            : "0.5px solid #b5b5b5",
      },
      "&:focus-within": {
        borderBottom:
          placeholder === "Package" || placeholder === "Select Unit"
            ? "none"
            : "0.5px solid #b5b5b5",
        boxShadow: "none",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0 8px",
      minHeight: "40px",
      lineHeight: "1.4",
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
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#000",
      fontSize: "14px",
    }),
    clearIndicator: (provided) => ({
      ...provided,
      cursor: "pointer",
      color: "#000000",
      padding: "4px",
      ":hover": {
        color: "#000",
      },
    }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#1D736B",
      padding: "4px",
      ":hover": {
        color: "#14524e",
      },
    }),
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
      ":active": {
        backgroundColor: "#1D736B",
        color: "white",
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  });

  const [modal, setModal] = useState<
    | null
    | { type: "create" }
    | { type: "add"; id: number }
    | { type: "delete"; colIndex: number }
  >(null);
  const [selectedColumnIndex, setSelectedColumnIndex] = useState<number>(0);

  const handleServiceSelect = (service: Service, colIndex: number) => {
    setSelectedService((prev) => {
      const newSelectedService = [...prev];
      newSelectedService[colIndex] = {
        value: service.id.toString(),
        label: service.service,
      };
      return newSelectedService;
    });

    handleTextChange("Location", colIndex, service.location);
    setSelectedTransportMode((prev) => {
      const newSelectedTransportMode = [...prev];
      newSelectedTransportMode[colIndex] = {
        value: service.transport_mode,
        label: service.transport_mode,
      };
      return newSelectedTransportMode;
    });
    setSelectedFrom((prev) => {
      const newSelectedFrom = [...prev];
      newSelectedFrom[colIndex] = { value: service.from, label: service.from };
      return newSelectedFrom;
    });
    setSelectedTo((prev) => {
      const newSelectedTo = [...prev];
      newSelectedTo[colIndex] = { value: service.to, label: service.to };
      return newSelectedTo;
    });
    setSelectedTransportType((prev) => {
      const newSelectedTransportType = [...prev];
      newSelectedTransportType[colIndex] = {
        value: service.transport_type,
        label: service.transport_type,
      };
      return newSelectedTransportType;
    });
    setSelectedVendor((prev) => {
      const newSelectedVendor = [...prev];
      newSelectedVendor[colIndex] = {
        value: service.vendor,
        label: service.vendor,
      };
      return newSelectedVendor;
    });
    handleTextChange(
      "Purchase price per ton",
      colIndex,
      service.purchase_price_ton.toString(),
    );
    handleTextChange(
      "Purchase price per unit",
      colIndex,
      service.purchase_price_unit.toString(),
    );
    setModal(null);
  };

  const openModalForColumn = (colIndex: number) => {
    setSelectedColumnIndex(colIndex);
    setModal({ type: "create" });
  };

  const openTableForColumn = (colIndex: number) => {
    setSelectedColumnIndex(colIndex);
    setModal({ type: "add", id: colIndex });
  };

  const displaySummaryData = [
    { label: "Amount", value: summaryData.amount },
    { label: "VAT", value: summaryData.vat },
    { label: "Total Amount", value: summaryData.totalAmount },
    { label: "Per Ton Price", value: summaryData.perTonPrice },
    { label: "Transportation Time", value: summaryData.transportationTime },
  ];

  return (
    <div className={styles.table_container}>
      <div className={styles.vat}>
        <table className={styles.custom_table}>
          <tbody>
            {staticRows.map((rowName, rowIndex) => {
              if (
                visibilityRules[rowName] &&
                !visibilityRules[rowName].includes(role)
              ) {
                return null;
              }

              return (
                <tr key={rowIndex}>
                  <td className={styles.static_col}>{rowName}</td>

                  {columns.map((colIndex) => {
                    const isDisabled =
                      role !== "admin" &&
                      disabledCells.includes(`${rowIndex}-${colIndex}`);

                    const calculatedValue =
                      calculatedValues[`${rowName}-${colIndex}`];

                    const displayValue =
                      textValues[`${rowName}-${colIndex}`] !== undefined
                        ? textValues[`${rowName}-${colIndex}`]
                        : calculatedValue !== undefined
                          ? calculatedValue.toString()
                          : "";

                    switch (rowName) {
                      case "Name of Service":
                        return (
                          <td key={colIndex}>
                            <div
                              className={styles.clickable_text}
                              style={{ cursor: "pointer" }}
                              onClick={() => openModalForColumn(colIndex)}
                            >
                              <p>
                                {selectedService[colIndex]?.label ||
                                  "Select Service"}
                              </p>
                              <SharedIcon />
                            </div>
                          </td>
                        );

                      case "Location":
                        return (
                          <td key={colIndex}>
                            <div
                              className={styles.clickable_text}
                              onClick={() =>
                                onLocationClick?.("Location clicked")
                              }
                            >
                              <p>
                                {textValues[`${rowName}-${colIndex}`] || ""}
                              </p>
                            </div>
                          </td>
                        );

                      case "Transport mode":
                        return (
                          <td key={colIndex}>
                            <div
                              className={styles.clickable_text}
                              onClick={() =>
                                onTransportModeClick?.("Transport mode clicked")
                              }
                            >
                              <p>
                                {" "}
                                {selectedTransportMode[colIndex]?.label || ""}
                              </p>
                            </div>
                          </td>
                        );

                      case "From":
                        return (
                          <td key={colIndex}>
                            <div
                              className={styles.clickable_text}
                              onClick={() => onFromClick?.("From clicked")}
                            >
                              <p> {selectedFrom[colIndex]?.label || ""}</p>
                            </div>
                          </td>
                        );

                      case "To":
                        return (
                          <td key={colIndex}>
                            <div
                              className={styles.clickable_text}
                              onClick={() => onToClick?.("To clicked")}
                            >
                              <p> {selectedTo[colIndex]?.label || ""}</p>
                            </div>
                          </td>
                        );

                      case "Transport type":
                        return (
                          <td key={colIndex}>
                            <div
                              className={styles.clickable_text}
                              onClick={() =>
                                onTransportTypeClick?.("Transport type clicked")
                              }
                            >
                              <p>
                                {selectedTransportType[colIndex]?.label || ""}
                              </p>
                            </div>
                          </td>
                        );

                      case "Vendor":
                        return (
                          <td key={colIndex}>
                            <div
                              className={styles.clickable_text}
                              onClick={() => onVendorClick?.("Vendor clicked")}
                            >
                              <p> {selectedVendor[colIndex]?.label || ""}</p>
                            </div>
                          </td>
                        );

                      case "Unit":
                        return (
                          <td key={colIndex}>
                            <Select
                              value={selectedUnit[colIndex]}
                              onChange={(option) =>
                                handleUnitChange(colIndex, option)
                              }
                              options={unitOptions}
                              styles={getPackagingStyles("Select Unit")}
                              isDisabled={isDisabled}
                              placeholder="Select Unit"
                              className={styles.react_select_container}
                              isClearable
                            />
                          </td>
                        );

                      case "Packaging Type":
                        return (
                          <td key={colIndex} className={styles.nested_cell}>
                            <div className={styles.vertical_inputs}>
                              <Select
                                value={selectedPackaging[rowIndex][colIndex][0]}
                                onChange={(option) =>
                                  handlePackagingChange(
                                    rowIndex,
                                    colIndex,
                                    0,
                                    option,
                                  )
                                }
                                options={packagingOptions1}
                                styles={getPackagingStyles("Type")}
                                isDisabled={isDisabled}
                                placeholder="Type"
                                className={styles.react_select_container}
                                isClearable
                              />
                              <Select
                                value={selectedPackaging[rowIndex][colIndex][1]}
                                onChange={(option) =>
                                  handlePackagingChange(
                                    rowIndex,
                                    colIndex,
                                    1,
                                    option,
                                  )
                                }
                                options={packagingOptions2}
                                styles={getPackagingStyles("Size")}
                                isDisabled={
                                  isDisabled ||
                                  selectedPackaging[rowIndex][colIndex][0]
                                    ?.value !== "Container"
                                }
                                placeholder="Size"
                                className={styles.react_select_container}
                                isClearable
                              />
                              <Select
                                value={selectedPackaging[rowIndex][colIndex][2]}
                                onChange={(option) =>
                                  handlePackagingChange(
                                    rowIndex,
                                    colIndex,
                                    2,
                                    option,
                                  )
                                }
                                options={getTypeOptions(
                                  selectedPackaging[rowIndex][colIndex][0]
                                    ?.value || "",
                                )}
                                styles={getPackagingStyles("Package")}
                                isDisabled={
                                  isDisabled ||
                                  !selectedPackaging[rowIndex][colIndex][0] ||
                                  selectedPackaging[rowIndex][colIndex][0]
                                    ?.value === "Oversize_Cargo"
                                }
                                placeholder={
                                  selectedPackaging[rowIndex][colIndex][0]
                                    ?.value === "Oversize_Cargo"
                                    ? "Not applicable"
                                    : "Package"
                                }
                                className={styles.react_select_container}
                                isClearable
                              />
                            </div>
                          </td>
                        );

                      case "VAT 18%":
                        return (
                          <td key={colIndex}>
                            <label className={styles.custom_checkbox}>
                              <input
                                type="checkbox"
                                disabled={isDisabled}
                                checked={
                                  textValues[`VAT 18%-${colIndex}`] === "true"
                                }
                                onChange={(e) =>
                                  handleTextChange(
                                    "VAT 18%",
                                    colIndex,
                                    e.target.checked ? "true" : "false",
                                  )
                                }
                              />
                            </label>
                          </td>
                        );

                      case "Price quotation":
                        return (
                          <td
                            key={colIndex}
                            onClick={() => openTableForColumn(colIndex)}
                          >
                            <div className={styles.sent__td}>
                              <div className={styles.sent}>
                                <p>Sent service quotation to Purchase team</p>
                                <SharedIcon />
                              </div>
                            </div>
                          </td>
                        );

                      case "Total purchase price":
                      case "Total price":
                      case "VAT amount":
                      case "Profit":
                        return (
                          <td key={colIndex} className={styles.td_dollar}>
                            <input
                              type="text"
                              value={displayValue}
                              onChange={(e) =>
                                handleTextChange(
                                  "Profit",
                                  colIndex,
                                  e.target.value,
                                )
                              }
                              className={styles.clickable_text}
                            />
                          </td>
                        );

                      case "Delete":
                        return (
                          <td key={colIndex}>
                            <div
                              className={styles.sent__td}
                              style={{ cursor: "pointer" }}
                              onClick={() => deleteColumn(colIndex)}
                            >
                              <DeleteIcon />
                            </div>
                          </td>
                        );

                      default:
                        return (
                          <td key={colIndex} className={styles.td_dollar}>
                            <input
                              type="text"
                              value={textValues[`${rowName}-${colIndex}`] || ""}
                              onChange={(e) =>
                                handleTextChange(
                                  rowName,
                                  colIndex,
                                  e.target.value,
                                )
                              }
                              className={styles.clickable_text}
                              disabled={isDisabled}
                            />
                          </td>
                        );
                    }
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className={styles.btn}>
          <button className={styles.add_btn} onClick={addColumn}>
            +<p>Add</p>
          </button>
        </div>
      </div>
      <div className={styles.amount}>
        {displaySummaryData.map((item, idx) => (
          <div key={idx} className={styles.boxes}>
            <p>{item.label}</p>
            <p>{item.value}</p>
          </div>
        ))}
      </div>
      {modal?.type === "create" && (
        <CreateServicesTable
          modalClose={() => {
            setModal(null);
          }}
          onServiceSelect={(service) =>
            handleServiceSelect(service, selectedColumnIndex)
          }
        />
      )}
      {modal?.type === "add" && (
        <PriceTable
          modalClose={() => {
            setModal(null);
          }}
          order_id={modal.id}
        />
      )}
      {modal?.type === "delete" && (
        <DeleteColumn
          modalClose={(isConfirm) => {
            if (isConfirm) {
              confirmDeleteColumn(modal.colIndex);
            } else {
              setModal(null);
            }
          }}
        />
      )}
    </div>
  );
}
