import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import styles from "../RowTable/RowTable.module.scss";
import Select, { StylesConfig } from "react-select";
import { DeleteIcon, SharedIcon } from "@/assets/icons/shared.vectors.tsx";
import CreateServicesTable from "@/features/dashboard/components/shared/Modals/ServicesTable/CreateServicesTable.tsx";
import PriceTable from "@/features/dashboard/components/shared/Modals/PriceTable/PriceTable.tsx";
import { QuotationData } from "@/features/dashboard/services/CommercialManager/commercial.service.ts";
import { useLocation } from "react-router-dom";

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
  id?: number;
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
  onServiceSelect?: (service: Service, colIndex: number) => void;
  onDeleteService?: (deletedIds: number[]) => void;
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
  rows: initialRows,
  summary: initialSummary,
  onTableDataChange,
  onDeleteService,
  onServiceSelect,
}: TableProps) {
  const location = useLocation();
  const order = location.state?.order;
  const [columns, setColumns] = useState<number[]>([]);
  const [selectedTransportType, setSelectedTransportType] = useState<
    (OptionType | null)[]
  >([]);
  const [selectedTransportMode, setSelectedTransportMode] = useState<
    (OptionType | null)[]
  >([]);
  const [selectedService, setSelectedService] = useState<(OptionType | null)[]>(
    [],
  );
  const [selectedVendor, setSelectedVendor] = useState<(OptionType | null)[]>(
    [],
  );
  const [selectedFrom, setSelectedFrom] = useState<(OptionType | null)[]>([]);
  const [selectedTo, setSelectedTo] = useState<(OptionType | null)[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<(OptionType | null)[]>([]);
  const [selectedPackaging, setSelectedPackaging] = useState<
    (OptionType | null)[][][]
  >(
    Array(staticRows.length)
      .fill(null)
      .map(() => []),
  );

  const [textValues, setTextValues] = useState<{ [key: string]: string }>({});
  const [calculatedValues, setCalculatedValues] = useState<{
    [key: string]: number;
  }>({});

  const [summaryData, setSummaryData] =
    useState<TableSummaryData>(initialSummary);

  const initialDataLoadedRef = useRef(false);
  const tableDataRef = useRef<CompleteTableData>({
    rows: [],
    summary: initialSummary,
  });

  const convertTableToJSON = useCallback((): CompleteTableData => {
    const rows: TableRowData[] = columns.map((_, colIndex) => {
      const unitType = selectedUnit[colIndex]?.value || "";

      const packagingRow = selectedPackaging[6];
      const packagingCol = packagingRow && packagingRow[colIndex];

      const packagingType = packagingCol?.[0]?.label || "";
      const packagingSize = packagingCol?.[1]?.label || "";
      const packagingPackage = packagingCol?.[2]?.label || "";

      return {
        id: initialRows[colIndex]?.id || 0,
        serviceName: selectedService[colIndex]?.value || "",
        location: textValues[`Location-${colIndex}`] || "",
        transportMode: selectedTransportMode[colIndex]?.label || "",
        from: selectedFrom[colIndex]?.label || "",
        to: selectedTo[colIndex]?.label || "",
        transportType: selectedTransportType[colIndex]?.label || "",
        packagingType,
        packagingSize,
        packagingPackage,
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
    initialRows,
  ]);

  const tableData = useMemo(() => convertTableToJSON(), [convertTableToJSON]);

  const stableOnTableDataChange = useCallback(
    (index: number, data: CompleteTableData) => {
      if (JSON.stringify(data) !== JSON.stringify(tableDataRef.current)) {
        tableDataRef.current = data;
        onTableDataChange?.(index, data);
      }
    },
    [onTableDataChange],
  );

  useEffect(() => {
    if (
      tableData.rows.length > 0 &&
      JSON.stringify(tableData) !== JSON.stringify(tableDataRef.current)
    ) {
      stableOnTableDataChange(index, tableData);
    }
  }, [tableData, index, stableOnTableDataChange]);

  useEffect(() => {
    if (
      initialRows &&
      initialRows.length > 0 &&
      !initialDataLoadedRef.current
    ) {
      const serviceCount = initialRows.length;
      const newColumns = Array.from({ length: serviceCount }, (_, i) => i);
      setColumns(newColumns);

      setSelectedTransportType(Array(serviceCount).fill(null));
      setSelectedTransportMode(Array(serviceCount).fill(null));
      setSelectedService(Array(serviceCount).fill(null));
      setSelectedVendor(Array(serviceCount).fill(null));
      setSelectedFrom(Array(serviceCount).fill(null));
      setSelectedTo(Array(serviceCount).fill(null));
      setSelectedUnit(Array(serviceCount).fill(null));

      const initialPackaging = Array(staticRows.length)
        .fill(null)
        .map(() =>
          Array(serviceCount)
            .fill(null)
            .map(() => Array(3).fill(null)),
        );
      setSelectedPackaging(initialPackaging);

      const newTextValues: { [key: string]: string } = {};

      initialRows.forEach((row, colIndex) => {
        if (row.serviceName) {
          setSelectedService((prev) => {
            const newArr = [...prev];
            newArr[colIndex] = {
              value: row.serviceName as string,
              label: row.serviceName as string,
            };
            return newArr;
          });
        }

        if (row.location) {
          newTextValues[`Location-${colIndex}`] = row.location;
        }

        if (row.transportMode) {
          setSelectedTransportMode((prev) => {
            const newArr = [...prev];
            newArr[colIndex] = {
              value: row.transportMode,
              label: row.transportMode,
            };
            return newArr;
          });
        }

        if (row.from) {
          setSelectedFrom((prev) => {
            const newArr = [...prev];
            newArr[colIndex] = { value: row.from, label: row.from };
            return newArr;
          });
        }

        if (row.to) {
          setSelectedTo((prev) => {
            const newArr = [...prev];
            newArr[colIndex] = { value: row.to, label: row.to };
            return newArr;
          });
        }

        if (row.transportType) {
          setSelectedTransportType((prev) => {
            const newArr = [...prev];
            newArr[colIndex] = {
              value: row.transportType,
              label: row.transportType,
            };
            return newArr;
          });
        }

        if (row.vendor) {
          setSelectedVendor((prev) => {
            const newArr = [...prev];
            newArr[colIndex] = { value: row.vendor, label: row.vendor };
            return newArr;
          });
        }

        if (row.unit) {
          setSelectedUnit((prev) => {
            const newArr = [...prev];
            newArr[colIndex] = { value: row.unit, label: row.unit };
            return newArr;
          });
        }

        if (row.packagingType) {
          setSelectedPackaging((prev) => {
            const newPackaging = [...prev];
            newPackaging[6] = [...newPackaging[6]];
            newPackaging[6][colIndex] = [...newPackaging[6][colIndex]];
            newPackaging[6][colIndex][0] = {
              value: row.packagingType,
              label: row.packagingType,
            };
            return newPackaging;
          });
        }

        if (row.packagingSize) {
          setSelectedPackaging((prev) => {
            const newPackaging = [...prev];
            newPackaging[6] = [...newPackaging[6]];
            newPackaging[6][colIndex] = [...newPackaging[6][colIndex]];
            newPackaging[6][colIndex][1] = {
              value: row.packagingSize,
              label: row.packagingSize,
            };
            return newPackaging;
          });
        }

        if (row.packagingPackage) {
          setSelectedPackaging((prev) => {
            const newPackaging = [...prev];
            newPackaging[6] = [...newPackaging[6]];
            newPackaging[6][colIndex] = [...newPackaging[6][colIndex]];
            newPackaging[6][colIndex][2] = {
              value: row.packagingPackage,
              label: row.packagingPackage,
            };
            return newPackaging;
          });
        }

        if (row.payload) {
          newTextValues[`PayLoad-${colIndex}`] = row.payload;
        }

        if (row.totalQuantity) {
          newTextValues[`Total quantity-${colIndex}`] = row.totalQuantity;
        }

        if (row.note) {
          newTextValues[`Note-${colIndex}`] = row.note;
        }

        if (row.profit) {
          newTextValues[`Profit-${colIndex}`] = row.profit;
        }

        const fields = [
          "netWeight",
          "grossWeight",
          "width",
          "length",
          "height",
          "estimatedTime",
          "purchasePricePerTon",
          "purchasePricePerUnit",
          "totalPurchasePrice",
          "sellingPrice",
          "totalPrice",
          "vatAmount",
        ];

        fields.forEach((field) => {
          if (row[field]) {
            const displayField =
              field === "estimatedTime"
                ? "Estimated Transportation Time"
                : field === "purchasePricePerTon"
                  ? "Purchase price per ton"
                  : field === "purchasePricePerUnit"
                    ? "Purchase price per unit"
                    : field === "totalPurchasePrice"
                      ? "Total purchase price"
                      : field === "sellingPrice"
                        ? "Selling price"
                        : field === "totalPrice"
                          ? "Total price"
                          : field === "vatAmount"
                            ? "VAT amount"
                            : field === "netWeight"
                              ? "Net weight ton"
                              : field === "grossWeight"
                                ? "Gross weight ton"
                                : field === "width"
                                  ? "Width (Meter)"
                                  : field === "length"
                                    ? "Length (Meter)"
                                    : field === "height"
                                      ? "Height (Meter)"
                                      : field;

            newTextValues[`${displayField}-${colIndex}`] = row[field] as string;
          }
        });

        if (row.vat18 !== undefined) {
          newTextValues[`VAT 18%-${colIndex}`] = row.vat18 ? "true" : "false";
        }
      });

      setTextValues(newTextValues);
      initialDataLoadedRef.current = true;
    }
  }, [initialRows]);

  const calculatedValuesWithMemo = useMemo(() => {
    const newCalculatedValues: { [key: string]: number } = {};
    let totalAmount = 0;
    let totalVAT = 0;
    let totalPurchasePrice = 0;
    let totalEstimatedTime = 0;

    columns.forEach((_, colIndex) => {
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

    const newSummaryData = {
      amount: `${totalAmount.toFixed(2)}$`,
      vat: `${totalVAT.toFixed(2)}$`,
      totalAmount: `${(totalAmount + totalVAT).toFixed(2)}$`,
      perTonPrice: `${totalPurchasePrice.toFixed(2)}$`,
      transportationTime: `${totalEstimatedTime} days`,
    };

    setSummaryData(newSummaryData);

    return newCalculatedValues;
  }, [textValues, selectedUnit, columns]);

  useEffect(() => {
    setCalculatedValues(calculatedValuesWithMemo);
  }, [calculatedValuesWithMemo]);

  const handleTextChange = useCallback(
    (rowName: string, colIndex: number, value: string) => {
      setTextValues((prev) => {
        const newValues = {
          ...prev,
          [`${rowName}-${colIndex}`]: value,
        };

        if (
          rowName === "PayLoad" ||
          rowName === "Selling price" ||
          rowName === "Purchase price per ton" ||
          rowName === "Purchase price per unit"
        ) {
          setCalculatedValues((prevCalc) => {
            const newCalc = { ...prevCalc };
            delete newCalc[`Total price-${colIndex}`];
            delete newCalc[`VAT amount-${colIndex}`];
            delete newCalc[`Total purchase price-${colIndex}`];
            delete newCalc[`Profit-${colIndex}`];
            return newCalc;
          });
        }

        return newValues;
      });
    },
    [],
  );

  const handlePackagingChange = useCallback(
    (
      rowIndex: number,
      colIndex: number,
      selectIndex: number,
      option: OptionType | null,
    ) => {
      setSelectedPackaging((prev) => {
        const newPackaging = [...prev];
        newPackaging[rowIndex] = [...newPackaging[rowIndex]];
        newPackaging[rowIndex][colIndex] = [
          ...newPackaging[rowIndex][colIndex],
        ];
        newPackaging[rowIndex][colIndex][selectIndex] = option;

        if (selectIndex === 0 && option) {
          newPackaging[rowIndex][colIndex][2] = null;
        }

        return newPackaging;
      });
    },
    [],
  );

  const handleUnitChange = useCallback(
    (colIndex: number, option: OptionType | null) => {
      setSelectedUnit((prev) => {
        const newSelectedUnit = [...prev];
        newSelectedUnit[colIndex] = option;
        return newSelectedUnit;
      });

      setCalculatedValues((prevCalc) => {
        const newCalc = { ...prevCalc };
        delete newCalc[`Total purchase price-${colIndex}`];
        delete newCalc[`Profit-${colIndex}`];
        return newCalc;
      });
    },
    [],
  );

  const addColumn = useCallback(() => {
    const newColIndex = columns.length;
    setColumns((prev) => [...prev, newColIndex]);
    setSelectedTransportType((prev) => [...prev, null]);
    setSelectedTransportMode((prev) => [...prev, null]);
    setSelectedService((prev) => [...prev, null]);
    setSelectedVendor((prev) => [...prev, null]);
    setSelectedFrom((prev) => [...prev, null]);
    setSelectedTo((prev) => [...prev, null]);
    setSelectedUnit((prev) => [...prev, null]);
    setSelectedPackaging((prev) =>
      prev.map((rowPackaging) => [...rowPackaging, Array(3).fill(null)]),
    );
  }, [columns.length]);

  const deleteColumn = useCallback(
    (colIndex: number) => {
      const deletedServiceId = initialRows[colIndex]?.id;

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

      if (deletedServiceId && onDeleteService) {
        onDeleteService([deletedServiceId]);
      }
    },
    [initialRows, onDeleteService],
  );

  const getPackagingStyles = useCallback(
    (placeholder?: string): StylesConfig<OptionType, false> => ({
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
    }),
    [],
  );

  const [modal, setModal] = useState<
    null | { type: "create" } | { type: "add"; id: number }
  >(null);
  const [selectedColumnIndex, setSelectedColumnIndex] = useState<number>(0);

  const handleServiceSelect = useCallback(
    (service: Service, colIndex: number) => {
      setSelectedService((prev) => {
        const newSelectedService = [...prev];
        newSelectedService[colIndex] = {
          value: service.id.toString(),
          label: service.service,
        };
        onServiceSelect?.(service, colIndex);
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
        newSelectedFrom[colIndex] = {
          value: service.from,
          label: service.from,
        };
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
    },
    [handleTextChange, onServiceSelect],
  );

  const openModalForColumn = useCallback((colIndex: number) => {
    setSelectedColumnIndex(colIndex);
    setModal({ type: "create" });
  }, []);

  const openTableForColumn = useCallback((colIndex: number) => {
    setSelectedColumnIndex(colIndex);
    setModal({ type: "add", id: colIndex });
  }, []);

  const displaySummaryData = useMemo(
    () => [
      { label: "Amount", value: summaryData.amount },
      { label: "VAT", value: summaryData.vat },
      { label: "Total Amount", value: summaryData.totalAmount },
      { label: "Per Ton Price", value: summaryData.perTonPrice },
      { label: "Transportation Time", value: summaryData.transportationTime },
    ],
    [summaryData],
  );

  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await QuotationData(order.order_id);
        if (response?.status === 200) {
          const apiData = response?.data;
          setOrderId(apiData.order_id);
        }
      } catch (error) {
        console.error("Error fetching quotation:", error);
      }
    };

    fetchRequest();
  }, [order]);

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
                <tr key={`row-${rowIndex}`}>
                  <td className={styles.static_col}>{rowName}</td>

                  {columns.map((colId, colIndex) => {
                    const isDisabled =
                      role !== "admin" &&
                      disabledCells.includes(`${rowIndex}-${colIndex}`);

                    const calculatedValue =
                      calculatedValues[`${rowName}-${colIndex}`];

                    const displayValue =
                      calculatedValue !== undefined
                        ? calculatedValue.toFixed(2)
                        : textValues[`${rowName}-${colIndex}`] || "";

                    switch (rowName) {
                      case "Name of Service":
                        return (
                          <td key={`${rowIndex}-${colIndex}-${colId}`}>
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
                          <td key={`${rowIndex}-${colIndex}-${colId}`}>
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
                          <td key={`${rowIndex}-${colIndex}-${colId}`}>
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
                          <td key={`${rowIndex}-${colIndex}-${colId}`}>
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
                          <td key={`${rowIndex}-${colIndex}-${colId}`}>
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
                          <td key={`${rowIndex}-${colIndex}-${colId}`}>
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
                          <td key={`${rowIndex}-${colIndex}-${colId}`}>
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
                          <td key={`${rowIndex}-${colIndex}-${colId}`}>
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
                          <td
                            key={`${rowIndex}-${colIndex}-${colId}`}
                            className={styles.nested_cell}
                          >
                            <div className={styles.vertical_inputs}>
                              <Select
                                value={
                                  selectedPackaging[6]?.[colIndex]?.[0] || null
                                }
                                onChange={(option) =>
                                  handlePackagingChange(6, colIndex, 0, option)
                                }
                                options={packagingOptions1}
                                styles={getPackagingStyles("Type")}
                                isDisabled={isDisabled}
                                placeholder="Type"
                                className={styles.react_select_container}
                                isClearable
                              />
                              <Select
                                value={
                                  selectedPackaging[6]?.[colIndex]?.[1] || null
                                }
                                onChange={(option) =>
                                  handlePackagingChange(6, colIndex, 1, option)
                                }
                                options={packagingOptions2}
                                styles={getPackagingStyles("Size")}
                                isDisabled={
                                  isDisabled ||
                                  selectedPackaging[6]?.[colIndex]?.[0]
                                    ?.value !== "Container"
                                }
                                placeholder="Size"
                                className={styles.react_select_container}
                                isClearable
                              />
                              <Select
                                value={
                                  selectedPackaging[6]?.[colIndex]?.[2] || null
                                }
                                onChange={(option) =>
                                  handlePackagingChange(6, colIndex, 2, option)
                                }
                                options={getTypeOptions(
                                  selectedPackaging[6]?.[colIndex]?.[0]
                                    ?.value || "",
                                )}
                                styles={getPackagingStyles("Package")}
                                isDisabled={
                                  isDisabled ||
                                  !selectedPackaging[6]?.[colIndex]?.[0] ||
                                  selectedPackaging[6]?.[colIndex]?.[0]
                                    ?.value === "Oversize_Cargo"
                                }
                                placeholder={
                                  selectedPackaging[6]?.[colIndex]?.[0]
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
                          <td key={`${rowIndex}-${colIndex}-${colId}`}>
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
                            key={`${rowIndex}-${colIndex}-${colId}`}
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
                        return (
                          <td
                            key={`${rowIndex}-${colIndex}-${colId}`}
                            className={styles.td_dollar}
                          >
                            <input
                              type="text"
                              value={displayValue}
                              readOnly
                              className={styles.clickable_text}
                            />
                          </td>
                        );
                      case "Profit":
                        return (
                          <td
                            key={`${rowIndex}-${colIndex}-${colId}`}
                            className={styles.td_dollar}
                          >
                            <input
                              type="text"
                              className={styles.clickable_text}
                            />
                          </td>
                        );

                      case "Delete":
                        return (
                          <td key={`${rowIndex}-${colIndex}-${colId}`}>
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
                          <td
                            key={`${rowIndex}-${colIndex}-${colId}`}
                            className={styles.td_dollar}
                          >
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
          <div key={`summary-${idx}`} className={styles.boxes}>
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
          order_id={orderId}
        />
      )}
    </div>
  );
}
