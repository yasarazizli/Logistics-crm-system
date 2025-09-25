import styles from "@/components/Modal/Modal.module.scss";
import React, { useState, useEffect, useContext } from "react";
import Input from "@/components/Input/Input.tsx";
import {
  GetAllCity,
  GetAllCountry,
  GetAllPort,
  GetAllStationCode,
} from "@/features/dashboard/services/PriceQuotation/pricequotation.services.ts";
import { FromToIcon } from "@/assets/icons/shared.vectors.tsx";
import Select, { SingleValue, StylesConfig } from "react-select";
import { QuotationData } from "@/features/dashboard/services/CommercialManager/commercial.service.ts";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";

export interface PackagingData {
  packing_type: string;
  container_type?: string;
  size?: number;
  total_quantity: number;
  net_weight: number;
  gross_weight: number;
  width?: number;
  height?: number;
  length?: number;
  packaging_type?: string;
}

interface QuotationType {
  cargo_name: string;
  cargo_pictures: string;
  container_route: { from: string; to: string };
  dangerous: boolean;
  full_route: { from: string; to: string };
  hs_code: string;
  in_row: number;
  msds: string;
  order_id: string;
  packing: {
    ID: number;
    package_type: string;
    packing_type: string;
    size: number;
    total_quantity: number;
    net_weight: number;
    gross_weight: number;
    width: number;
    height: number;
    length: number;
    is_delete: boolean;
    created: string;
    updated: string;
  };
  period_transport: string;
  request_container_provision: boolean;
  request_wagon_provision: boolean;
  requested_route: { from: string; to: string };
  stackable: boolean;
  total_weight: number;
  transport_type: string;
  un_code: string;
  wagon_route: { from: string; to: string };
  wagon_type: string;
}

interface OptionType {
  value: string;
  label: string;
}

export interface RouteData {
  start_country_id: number | null;
  start_city_id: number | null;
  start_address: string;
  start_station_id: number | null;
  start_port_id: number | null;
  end_country_id: number | null;
  end_city_id: number | null;
  end_address: string;
  end_station_id: number | null;
  end_port_id: number | null;
  is_main: boolean;
  route_type: string;
}

interface Option {
  value: string;
  label: string;
}

interface PackagingFormProps {
  onDataChange: (data: PackagingData) => void;
  onRoutesChange?: (newRoutes: RouteData[]) => void;
  onStackableChange?: (stackable: boolean) => void;
  onInRowChange?: (inRow: number) => void;
  onContainerProvisionChange?: (provision: boolean) => void;
  onWagonProvisionChange?: (provision: boolean) => void;
  onTransportationTypeChange?: (type: string) => void;
  onWagonTypeChange?: (type: string) => void;
}

interface Country {
  id: number;
  name: string;
}

interface StationCode {
  value: string;
  name: string;
}

interface Location {
  country: string;
  city: string;
  hs: string;
  address?: string;
  port?: string;
}

interface City {
  value: string;
  name: string;
}

interface Port {
  id: number;
  name: string;
}

const PackagingForm: React.FC<PackagingFormProps> = ({
  onDataChange,
  onRoutesChange,
  onStackableChange,
  onInRowChange,
  onContainerProvisionChange,
  onWagonProvisionChange,
  onTransportationTypeChange,
  onWagonTypeChange,
}) => {
  const { setLoader } = useContext(LoaderContext);
  const [selectedOption1, setSelectedOption1] = useState("");
  const [selectedOption2, setSelectedOption2] = useState("20");
  const [selectedOption3, setSelectedOption3] = useState("");
  const [containerInputs, setContainerInputs] = useState({
    totalQuantity: "",
    netWeight: "",
    grossWeight: "",
  });
  const [breakBulkInputs, setBreakBulkInputs] = useState({
    totalQuantity: "",
    netWeight: "",
    grossWeight: "",
    width: "",
    length: "",
    height: "",
  });
  const [bulkLiquidInputs, setBulkLiquidInputs] = useState({
    netWeight: "",
  });
  const [generalInputs, setGeneralInputs] = useState({
    totalQuantity: "",
    netWeight: "",
    grossWeight: "",
    width: "",
    length: "",
    height: "",
  });
  const [showPackingType, setShowPackingType] = useState(false);
  const [packingType, setPackingType] = useState("");
  const [showPackingTypeInput, setShowPackingTypeInput] = useState(false);

  const [transportationType, setTransportationType] = useState<string>("Rail");
  const [wagonType, setWagonType] = useState<string>("");
  const [wagonProvision, setWagonProvision] = useState<boolean>(false);
  const [wagonProvision2, setWagonProvision2] = useState<boolean>(false);

  const [countries, setCountries] = useState<Country[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [routes, setRoutes] = useState([
    {
      from: { country: "", city: "", hs: "", address: "", port: "" },
      to: { country: "", city: "", hs: "", address: "", port: "" },
      fromCities: [] as City[],
      toCities: [] as City[],
      fromStationCodes: [] as StationCode[],
      toStationCodes: [] as StationCode[],
      fromPorts: [] as Port[],
      toPorts: [] as Port[],
    },
    {
      from: { country: "", city: "", hs: "", address: "", port: "" },
      to: { country: "", city: "", hs: "", address: "", port: "" },
      fromCities: [] as City[],
      toCities: [] as City[],
      fromStationCodes: [] as StationCode[],
      toStationCodes: [] as StationCode[],
      fromPorts: [] as Port[],
      toPorts: [] as Port[],
    },
    {
      from: { country: "", city: "", hs: "", address: "", port: "" },
      to: { country: "", city: "", hs: "", address: "", port: "" },
      fromCities: [] as City[],
      toCities: [] as City[],
      fromStationCodes: [] as StationCode[],
      toStationCodes: [] as StationCode[],
      fromPorts: [] as Port[],
      toPorts: [] as Port[],
    },
    {
      from: { country: "", city: "", hs: "", address: "", port: "" },
      to: { country: "", city: "", hs: "", address: "", port: "" },
      fromCities: [] as City[],
      toCities: [] as City[],
      fromStationCodes: [] as StationCode[],
      toStationCodes: [] as StationCode[],
      fromPorts: [] as Port[],
      toPorts: [] as Port[],
    },
  ]);

  const [quotation, setQuotation] = useState<QuotationType | null>(null);

  useEffect(() => {
    setLoader(true);
    const fetchRequest = async () => {
      try {
        const response = await QuotationData(5);
        if (response?.status === 200 && response.data) {
          const apiData = response.data;
          setQuotation(apiData);
          console.log("API-dən gələn BÜTÜN məlumatlar:", apiData);

          if (apiData.packing) {
            setSelectedOption1(apiData.packing.package_type || "");
            setSelectedOption2(apiData.packing.size?.toString() || "");
            setSelectedOption3(apiData.packing.packing_type || "");

            setContainerInputs({
              totalQuantity: apiData.packing.total_quantity?.toString() || "",
              netWeight: apiData.packing.net_weight?.toString() || "",
              grossWeight: apiData.packing.gross_weight?.toString() || "",
            });

            setBreakBulkInputs({
              totalQuantity: apiData.packing.total_quantity?.toString() || "",
              netWeight: apiData.packing.net_weight?.toString() || "",
              grossWeight: apiData.packing.gross_weight?.toString() || "",
              width: apiData.packing.width?.toString() || "",
              length: apiData.packing.length?.toString() || "",
              height: apiData.packing.height?.toString() || "",
            });

            setGeneralInputs({
              totalQuantity: apiData.packing.total_quantity?.toString() || "",
              netWeight: apiData.packing.net_weight?.toString() || "",
              grossWeight: apiData.packing.gross_weight?.toString() || "",
              width: apiData.packing.width?.toString() || "",
              length: apiData.packing.length?.toString() || "",
              height: apiData.packing.height?.toString() || "",
            });

            setBulkLiquidInputs({
              netWeight: apiData.packing.net_weight?.toString() || "",
            });
          }

          setShowPackingTypeInput(apiData.stackable || false);
          setPackingType(apiData.in_row?.toString() || "");

          if (apiData.transport_type) {
            const transportType =
              apiData.transport_type.charAt(0).toUpperCase() +
              apiData.transport_type.slice(1);
            setTransportationType(transportType);
          }

          setWagonType(apiData?.wagon_type || "");

          setWagonProvision2(apiData.request_container_provision || false);
          setWagonProvision(apiData.request_wagon_provision || false);

          parseAndSetRoutes(apiData);
          console.log(quotation);

          console.log("BÜTÜN məlumatlar uğurla set edildi!");
        }
      } catch (error) {
        console.error("Məlumatlar yüklənərkən xəta:", error);
      }
    };

    fetchRequest();
  }, []);

  const parseAndSetRoutes = (apiData: QuotationType) => {
    const newRoutes = [...routes];

    if (apiData.full_route?.from && apiData.full_route?.to) {
      try {
        const fromParts = apiData.full_route.from.split(" / ");
        const toParts = apiData.full_route.to.split(" / ");

        if (fromParts.length >= 3 && toParts.length >= 3) {
          newRoutes[0] = {
            ...newRoutes[0],
            from: {
              country: fromParts[0] || "",
              city: fromParts[1] || "",
              hs: fromParts[2] || "",
              address: "",
              port: "",
            },
            to: {
              country: toParts[0] || "",
              city: toParts[1] || "",
              hs: toParts[2] || "",
              address: "",
              port: "",
            },
          };
          console.log("Full route set edildi:", newRoutes[0]);
        }
      } catch (error) {
        console.error("Full route parse error:", error);
      }
    }

    if (apiData.requested_route?.from && apiData.requested_route?.to) {
      try {
        const fromParts = apiData.requested_route.from.split(" / ");
        const toParts = apiData.requested_route.to.split(" / ");

        if (fromParts.length >= 3 && toParts.length >= 3) {
          newRoutes[1] = {
            ...newRoutes[1],
            from: {
              country: fromParts[0] || "",
              city: fromParts[1] || "",
              hs: fromParts[2] || "",
              address: "",
              port: "",
            },
            to: {
              country: toParts[0] || "",
              city: toParts[1] || "",
              hs: toParts[2] || "",
              address: "",
              port: "",
            },
          };
          console.log("Requested route set edildi:", newRoutes[1]);
        }
      } catch (error) {
        console.error("Requested route parse error:", error);
      }
    }

    if (apiData.container_route?.from && apiData.container_route?.to) {
      try {
        const fromParts = apiData.container_route.from.split(" / ");
        const toParts = apiData.container_route.to.split(" / ");

        if (fromParts.length >= 3 && toParts.length >= 3) {
          newRoutes[2] = {
            ...newRoutes[2],
            from: {
              country: fromParts[0] || "",
              city: fromParts[1] || "",
              hs: fromParts[2] || "",
              address: "",
              port: "",
            },
            to: {
              country: toParts[0] || "",
              city: toParts[1] || "",
              hs: toParts[2] || "",
              address: "",
              port: "",
            },
          };
          console.log("Container route set edildi:", newRoutes[2]);
        }
      } catch (error) {
        console.error("Container route parse error:", error);
      }
    }

    if (apiData.wagon_route?.from && apiData.wagon_route?.to) {
      try {
        const fromParts = apiData.wagon_route.from.split(" / ");
        const toParts = apiData.wagon_route.to.split(" / ");

        if (fromParts.length >= 3 && toParts.length >= 3) {
          newRoutes[3] = {
            ...newRoutes[3],
            from: {
              country: fromParts[0] || "",
              city: fromParts[1] || "",
              hs: fromParts[2] || "",
              address: "",
              port: "",
            },
            to: {
              country: toParts[0] || "",
              city: toParts[1] || "",
              hs: toParts[2] || "",
              address: "",
              port: "",
            },
          };
          console.log("Wagon route set edildi:", newRoutes[3]);
        }
      } catch (error) {
        console.error("Wagon route parse error:", error);
      }
    }

    setLoader(false);
    setRoutes(newRoutes);
  };

  const titles = [
    "Full route",
    "Requested route",
    "Empty Return Container",
    "Empty Return Wagon",
  ];

  useEffect(() => {
    if (onWagonTypeChange) onWagonTypeChange(wagonType);
  }, [wagonType, onWagonTypeChange]);

  useEffect(() => {
    if (onTransportationTypeChange)
      onTransportationTypeChange(transportationType);
  }, [transportationType, onTransportationTypeChange]);

  useEffect(() => {
    if (onStackableChange) onStackableChange(showPackingTypeInput);
  }, [showPackingTypeInput, onStackableChange]);

  useEffect(() => {
    if (onInRowChange) onInRowChange(parseInt(packingType) || 0);
  }, [packingType, onInRowChange]);

  useEffect(() => {
    if (onContainerProvisionChange) onContainerProvisionChange(wagonProvision2);
  }, [wagonProvision2, onContainerProvisionChange]);

  useEffect(() => {
    if (onWagonProvisionChange) onWagonProvisionChange(wagonProvision);
  }, [wagonProvision, onWagonProvisionChange]);

  useEffect(() => {
    if (!onRoutesChange) return;

    const formattedRoutes: RouteData[] = routes.map((route, index) => {
      const parseNumber = (value: any): number | null => {
        if (value === undefined || value === null || value === "") return null;
        const num = Number(value);
        return isNaN(num) ? null : num;
      };

      const routeType =
        ["full", "requested", "container", "wagon"][index] || "full";
      const transportType = transportationType;

      const startCountryId = parseNumber(
        countries.find((c) => c.name === route.from.country)?.id,
      );
      const endCountryId = parseNumber(
        countries.find((c) => c.name === route.to.country)?.id,
      );

      const startCityId = parseNumber(
        route.from.city
          ? route.fromCities.find((c) => c.name === route.from.city)?.value
          : null,
      );
      const endCityId = parseNumber(
        route.to.city
          ? route.toCities.find((c) => c.name === route.to.city)?.value
          : null,
      );

      const startPortId =
        transportType === "Sea"
          ? parseNumber(
              route.fromPorts.find((p) => p.name === route.from.port)?.id,
            )
          : null;

      const endPortId =
        transportType === "Sea"
          ? parseNumber(route.toPorts.find((p) => p.name === route.to.port)?.id)
          : null;

      const startStationId =
        transportType === "Rail" ? parseNumber(route.from.hs) : null;
      const endStationId =
        transportType === "Rail" ? parseNumber(route.to.hs) : null;

      const startAddress =
        transportType === "Road" || transportType === "Multimodal"
          ? route.from.address || ""
          : "";
      const endAddress =
        transportType === "Road" || transportType === "Multimodal"
          ? route.to.address || ""
          : "";

      return {
        start_country_id: startCountryId,
        start_city_id: startCityId,
        start_address: startAddress,
        start_station_id: startStationId,
        start_port_id: startPortId,
        end_country_id: endCountryId,
        end_city_id: endCityId,
        end_address: endAddress,
        end_station_id: endStationId,
        end_port_id: endPortId,
        is_main: index === 0,
        route_type: routeType,
      };
    });

    onRoutesChange(formattedRoutes);
  }, [routes, onRoutesChange, countries, transportationType]);

  const handleContainerInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setContainerInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleBreakBulkInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setBreakBulkInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleBulkLiquidInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setBulkLiquidInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleGeneralInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGeneralInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handlePackingTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPackingType(e.target.value);
  };

  const handlePackingTypeCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setShowPackingTypeInput(e.target.checked);
    if (!e.target.checked) setPackingType("");
  };

  useEffect(() => {
    GetAllCountry().then((res) => setCountries(res?.data?.data || []));
  }, []);

  useEffect(() => {
    setShowPackingType(
      selectedOption1 === "Break_Bulk" ||
        (selectedOption1 === "Bulk" && selectedOption3 !== "Bulk Liquid") ||
        selectedOption1 === "Oversize_Cargo",
    );
  }, [selectedOption1, selectedOption3]);

  useEffect(() => {
    updateParentData();
  }, [
    selectedOption1,
    selectedOption2,
    selectedOption3,
    containerInputs,
    breakBulkInputs,
    bulkLiquidInputs,
    generalInputs,
    packingType,
    showPackingTypeInput,
  ]);

  const updateParentData = () => {
    let packagingData: PackagingData;

    const selectedTypeLabel = selectedOption3
      ? getTypeOptions(selectedOption1).find(
          (opt) => opt.value === selectedOption3,
        )?.label || ""
      : undefined;

    if (selectedOption1 === "Container") {
      packagingData = {
        packing_type: "Container",
        container_type: selectedTypeLabel,
        size: parseInt(selectedOption2) || 0,
        total_quantity: parseInt(containerInputs.totalQuantity) || 0,
        net_weight: parseFloat(containerInputs.netWeight) || 0,
        gross_weight: parseFloat(containerInputs.grossWeight) || 0,
      };
    } else if (selectedOption1 === "Break_Bulk") {
      packagingData = {
        packing_type: "Break_Bulk",
        container_type: selectedTypeLabel,
        total_quantity: parseInt(breakBulkInputs.totalQuantity) || 0,
        net_weight: parseFloat(breakBulkInputs.netWeight) || 0,
        gross_weight: parseFloat(breakBulkInputs.grossWeight) || 0,
        width: parseFloat(breakBulkInputs.width) || 0,
        height: parseFloat(breakBulkInputs.height) || 0,
        length: parseFloat(breakBulkInputs.length) || 0,
        packaging_type: showPackingTypeInput ? packingType : undefined,
      };
    } else if (
      selectedOption1 === "Bulk" &&
      selectedOption3 === "Bulk Liquid"
    ) {
      packagingData = {
        packing_type: "Bulk_Liquid",
        container_type: selectedTypeLabel,
        net_weight: parseFloat(bulkLiquidInputs.netWeight) || 0,
        total_quantity: 0,
        gross_weight: 0,
      };
    } else if (selectedOption1 === "Oversize_Cargo") {
      packagingData = {
        packing_type: "Oversize_Cargo",
        total_quantity: parseInt(generalInputs.totalQuantity) || 0,
        net_weight: parseFloat(generalInputs.netWeight) || 0,
        gross_weight: parseFloat(generalInputs.grossWeight) || 0,
        width: parseFloat(generalInputs.width) || 0,
        height: parseFloat(generalInputs.height) || 0,
        length: parseFloat(generalInputs.length) || 0,
      };
    } else {
      packagingData = {
        packing_type: selectedOption1,
        container_type: selectedTypeLabel,
        total_quantity: parseInt(generalInputs.totalQuantity) || 0,
        net_weight: parseFloat(generalInputs.netWeight) || 0,
        gross_weight: parseFloat(generalInputs.grossWeight) || 0,
        width: parseFloat(generalInputs.width) || 0,
        height: parseFloat(generalInputs.height) || 0,
        length: parseFloat(generalInputs.length) || 0,
        packaging_type: showPackingTypeInput ? packingType : undefined,
      };
    }

    onDataChange(packagingData);
  };

  const swapFromTo = (index: number) => {
    setRoutes((prev) => {
      const newRoutes = [...prev];
      const temp = { ...newRoutes[index].from };
      newRoutes[index].from = { ...newRoutes[index].to };
      newRoutes[index].to = temp;
      return newRoutes;
    });
  };

  const handleCountryChange = (
    index: number,
    type: "from" | "to",
    country: string,
  ) => {
    setRoutes((prev) => {
      const updated = [...prev];

      updated[index][type] = {
        country,
        city: "",
        hs: "",
        address: "",
        port: "",
      };

      if (type === "from") {
        updated[index].fromCities = [];
        updated[index].fromStationCodes = [];
        updated[index].fromPorts = [];
      } else {
        updated[index].toCities = [];
        updated[index].toStationCodes = [];
        updated[index].toPorts = [];
      }

      GetAllCity(country).then((res) => {
        if (type === "from") {
          updated[index].fromCities = res?.data || [];
        } else {
          updated[index].toCities = res?.data || [];
        }
        setRoutes([...updated]);
      });

      GetAllStationCode(country).then((res) => {
        if (type === "from") {
          updated[index].fromStationCodes = res?.data || [];
        } else {
          updated[index].toStationCodes = res?.data || [];
        }
        setRoutes([...updated]);
      });

      GetAllPort(country).then((res) => {
        if (type === "from") {
          updated[index].fromPorts = res?.data?.data || [];
        } else {
          updated[index].toPorts = res?.data?.data || [];
        }
        setRoutes([...updated]);
      });

      return updated;
    });
  };

  const handleFieldChange = <K extends keyof Location>(
    index: number,
    type: "from" | "to",
    field: K,
    value: string,
  ) => {
    setRoutes((prev) => {
      const updated = [...prev];
      updated[index][type][field] = value;

      if (field === "country" && value !== updated[index][type].country) {
        updated[index][type] = {
          country: value,
          city: "",
          hs: "",
          address: "",
          port: "",
        };

        if (type === "from") {
          updated[index].fromCities = [];
          updated[index].fromStationCodes = [];
          updated[index].fromPorts = [];
        } else {
          updated[index].toCities = [];
          updated[index].toStationCodes = [];
          updated[index].toPorts = [];
        }

        GetAllCity(value).then((res) => {
          if (type === "from") {
            updated[index].fromCities = res?.data || [];
          } else {
            updated[index].toCities = res?.data || [];
          }
          setRoutes([...updated]);
        });

        GetAllStationCode(value).then((res) => {
          if (type === "from") {
            updated[index].fromStationCodes = res?.data || [];
          } else {
            updated[index].toStationCodes = res?.data || [];
          }
          setRoutes([...updated]);
        });

        GetAllPort(value).then((res) => {
          if (type === "from") {
            updated[index].fromPorts = res?.data?.data || [];
          } else {
            updated[index].toPorts = res?.data?.data || [];
          }
          setRoutes([...updated]);
        });
      }

      return [...updated];
    });
  };

  const customStyles: StylesConfig<Option, false> = {
    control: (provided) => ({
      ...provided,
      borderRadius: 6,
      border: "1px solid #E7E7E7",
      backgroundColor: "#F5F5F5",
      height: "53px",
      fontFamily: "Manrope",
      fontSize: "14px",
      fontWeight: 500,
      boxShadow: "none",
      color: "#7b7979",
      "&:hover": { border: "1px solid #E7E7E7" },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "10px 10px",
      overflow: "visible",
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
      overflow: "visible",
    }),
    placeholder: (provided) => ({ ...provided, color: "rgba(0,0,0,0.48)" }),
    clearIndicator: (provided) => ({
      ...provided,
      cursor: "pointer",
      color: "#000000",
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
          ? "#aed2ae"
          : "white",
      color: state.isSelected ? "white" : "#000",
      ":active": { backgroundColor: "#1D736B", color: "white" },
    }),
  };

  const containerOptions: OptionType[] = [
    { value: "Container", label: "Container" },
    { value: "Break_Bulk", label: "Break Bulk" },
    { value: "Bulk", label: "Bulk" },
    { value: "Oversize_Cargo", label: "Oversize Cargo" },
  ];

  const sizeOptions: OptionType[] = [
    { value: "20", label: "20" },
    { value: "40", label: "40" },
    { value: "45", label: "45" },
    { value: "other", label: "Other" },
  ];

  const transportationOptions: OptionType[] = [
    { value: "Rail", label: "Rail" },
    { value: "Road", label: "Road" },
    { value: "Sea", label: "Sea" },
    { value: "Multimodal", label: "Multimodal" },
  ];

  type TransportationType = "Rail" | "Road" | "Sea" | "Multimodal";
  const wagonOptions: Record<
    Exclude<TransportationType, "Multimodal">,
    string[]
  > = {
    Rail: [
      "Covered Wagons",
      "Open Wagons",
      "Flat Wagons",
      "Tank Wagons",
      "Hopper Wagons",
      "Fitting Platform",
    ],
    Road: [
      "Container Ship",
      "Tent",
      "Flatbed",
      "Reefer",
      "Lowbed",
      "CarCarrier",
    ],
    Sea: [
      "Container/Feeder Vessel",
      "General Cargo",
      "Tanker",
      "Roll on / Roll off (RORO)",
      "Other",
    ],
  };

  const wagonOptionsForSelect: OptionType[] =
    wagonOptions[transportationType as "Rail" | "Road" | "Sea"]?.map(
      (w: string) => ({ value: w, label: w }),
    ) || [];

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
    } else {
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
    }
  };

  useEffect(() => {
    setSelectedOption3("");
  }, [selectedOption1]);

  return (
    <div className={styles.packing}>
      <h2 className={styles.title}>Packaging Type</h2>
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "15px",
          marginTop: "15px",
        }}
      >
        <div style={{ width: "100%" }}>
          <div className={styles.selectWrapper}>
            <label className={styles.label}>Container</label>
            <Select
              value={containerOptions.find(
                (option) => option.value === selectedOption1,
              )}
              onChange={(option: SingleValue<OptionType>) =>
                setSelectedOption1(option ? option.value : "")
              }
              options={containerOptions}
              styles={customStyles}
              isClearable
              placeholder="Select Container Type"
            />
          </div>

          <div style={{ marginTop: "20px" }}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                className={styles.custom__checkbox}
                checked={wagonProvision2}
                onChange={(e) => setWagonProvision2(e.target.checked)}
                style={{ marginRight: "10px" }}
              />
              <span>Request Container Provision</span>
            </label>
          </div>
        </div>

        {selectedOption1 === "Container" && (
          <div className={styles.selectWrapper}>
            <label className={styles.label}>Size</label>
            <Select<OptionType, false>
              value={sizeOptions.find(
                (option) => option.value === selectedOption2,
              )}
              onChange={(option: SingleValue<OptionType>) =>
                setSelectedOption2(option ? option.value : "")
              }
              options={sizeOptions}
              styles={customStyles}
              isClearable
              placeholder="Select Size"
            />
          </div>
        )}

        {selectedOption1 !== "Oversize_Cargo" && (
          <div className={styles.selectWrapper}>
            <label className={styles.label}>Type</label>
            <Select<OptionType, false>
              value={
                getTypeOptions(selectedOption1).find(
                  (option) => option.value === selectedOption3,
                ) || null
              }
              onChange={(option: SingleValue<OptionType>) =>
                setSelectedOption3(option ? option.value : "")
              }
              options={getTypeOptions(selectedOption1)}
              styles={customStyles}
              isClearable
              placeholder="Select Type"
            />
          </div>
        )}
      </div>

      {selectedOption1 === "Container" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginTop: "10px",
          }}
        >
          <Input
            type="number"
            className={styles.input}
            label="Total Quantity"
            name="totalQuantity"
            value={containerInputs.totalQuantity}
            onChange={handleContainerInputChange}
            placeholder="Total Quantity-Container"
          />
          <Input
            type="number"
            className={styles.input}
            name="netWeight"
            label="Net Weight"
            value={containerInputs.netWeight}
            onChange={handleContainerInputChange}
            placeholder="Per Container Net Weight(Ton)"
          />
          <Input
            type="number"
            className={styles.input}
            name="grossWeight"
            label="Gross Weight"
            value={containerInputs.grossWeight}
            onChange={handleContainerInputChange}
            placeholder="Per Container Gross Weight(Ton)"
          />
        </div>
      )}

      {selectedOption1 === "Break_Bulk" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginTop: "10px",
          }}
        >
          <div style={{ display: "flex", gap: "20px" }}>
            <Input
              type="number"
              className={styles.input}
              name="totalQuantity"
              label="Total Quantity"
              value={breakBulkInputs.totalQuantity}
              onChange={handleBreakBulkInputChange}
              placeholder="Total Quantity"
            />
            <Input
              type="number"
              className={styles.input}
              name="netWeight"
              label="Net Weight"
              value={breakBulkInputs.netWeight}
              onChange={handleBreakBulkInputChange}
              placeholder="Net Weight(Ton)"
            />
            <Input
              type="number"
              className={styles.input}
              name="grossWeight"
              label="Gross Weight"
              value={breakBulkInputs.grossWeight}
              onChange={handleBreakBulkInputChange}
              placeholder="Gross Weight(Ton)"
            />
          </div>
          <div className={styles.applicable}>
            <div className={styles.name}>If Applicable</div>
            <div style={{ display: "flex", gap: "20px", padding: "16px" }}>
              <Input
                type="number"
                name="width"
                label="Width"
                placeholder="Enter width"
                value={breakBulkInputs.width}
                onChange={handleBreakBulkInputChange}
              />
              <Input
                type="number"
                className={styles.input}
                name="length"
                label="Length"
                placeholder="Enter length"
                value={breakBulkInputs.length}
                onChange={handleBreakBulkInputChange}
              />
              <Input
                type="number"
                className={styles.input}
                name="height"
                label="Height"
                placeholder="Enter height"
                value={breakBulkInputs.height}
                onChange={handleBreakBulkInputChange}
              />
            </div>
          </div>
        </div>
      )}

      {selectedOption1 === "Bulk" && selectedOption3 === "Bulk Liquid" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginTop: "10px",
          }}
        >
          <Input
            type="number"
            className={styles.input}
            name="netWeight"
            label="Net Weight (m3 / lt)"
            value={bulkLiquidInputs.netWeight}
            onChange={handleBulkLiquidInputChange}
            placeholder="Net Weight"
          />
        </div>
      )}

      {selectedOption1 === "Bulk" && selectedOption3 !== "Bulk Liquid" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginTop: "10px",
          }}
        >
          <div style={{ display: "flex", gap: "20px" }}>
            <Input
              type="number"
              className={styles.input}
              name="totalQuantity"
              label="Total Quantity"
              value={generalInputs.totalQuantity}
              onChange={handleGeneralInputChange}
              placeholder="Total Quantity"
            />
            <Input
              type="number"
              className={styles.input}
              name="netWeight"
              label="Net Weight"
              value={generalInputs.netWeight}
              onChange={handleGeneralInputChange}
              placeholder="Net Weight(Ton)"
            />
            <Input
              type="number"
              className={styles.input}
              name="grossWeight"
              label="Gross Weight"
              value={generalInputs.grossWeight}
              onChange={handleGeneralInputChange}
              placeholder="Gross Weight(Ton)"
            />
          </div>
          <div className={styles.applicable}>
            <div className={styles.name}>If Applicable</div>
            <div style={{ display: "flex", gap: "20px", padding: "16px" }}>
              <Input
                type="number"
                label="Width"
                name="width"
                placeholder="Enter width"
                value={generalInputs.width}
                onChange={handleGeneralInputChange}
              />
              <Input
                type="number"
                className={styles.input}
                name="length"
                label="Length"
                placeholder="Enter length"
                value={generalInputs.length}
                onChange={handleGeneralInputChange}
              />
              <Input
                type="number"
                className={styles.input}
                name="height"
                label="Height"
                placeholder="Enter height"
                value={generalInputs.height}
                onChange={handleGeneralInputChange}
              />
            </div>
          </div>
        </div>
      )}

      {selectedOption1 === "Oversize_Cargo" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginTop: "10px",
          }}
        >
          <div style={{ display: "flex", gap: "20px" }}>
            <Input
              type="number"
              className={styles.input}
              name="totalQuantity"
              label="Total Quantity"
              value={generalInputs.totalQuantity}
              onChange={handleGeneralInputChange}
              placeholder="Total Quantity"
            />
            <Input
              type="number"
              className={styles.input}
              name="netWeight"
              label="Net Weight"
              value={generalInputs.netWeight}
              onChange={handleGeneralInputChange}
              placeholder="Net Weight(Ton)"
            />
            <Input
              type="number"
              className={styles.input}
              name="grossWeight"
              label="Gross Weight"
              value={generalInputs.grossWeight}
              onChange={handleGeneralInputChange}
              placeholder="Gross Weight(Ton)"
            />
          </div>
          <div className={styles.applicable}>
            <div className={styles.name}>If Applicable</div>
            <div style={{ display: "flex", gap: "20px", padding: "16px" }}>
              <Input
                type="number"
                label="Width"
                name="width"
                placeholder="Enter width"
                value={generalInputs.width}
                onChange={handleGeneralInputChange}
              />
              <Input
                type="number"
                className={styles.input}
                name="length"
                label="Length"
                placeholder="Enter length"
                value={generalInputs.length}
                onChange={handleGeneralInputChange}
              />
              <Input
                type="number"
                className={styles.input}
                name="height"
                label="Height"
                placeholder="Enter height"
                value={generalInputs.height}
                onChange={handleGeneralInputChange}
              />
            </div>
          </div>
        </div>
      )}

      {showPackingType && (
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              display: "flex",
              padding: "15px",
              backgroundColor: "#F5F5F5",
              alignItems: "center",
            }}
          >
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                className={styles.custom__checkbox}
                id="packingTypeCheckbox"
                checked={showPackingTypeInput}
                onChange={handlePackingTypeCheckboxChange}
                style={{ marginRight: "10px" }}
              />
            </label>
            <label htmlFor="packingTypeCheckbox" className={styles.label}>
              Stackable
            </label>
          </div>

          {showPackingTypeInput && (
            <div style={{ width: "350px" }}>
              <Input
                type="text"
                placeholder="In Row"
                value={packingType}
                onChange={handlePackingTypeChange}
              />
            </div>
          )}
        </div>
      )}

      <div
        style={{
          marginTop: "40px",
          borderTop: "2px solid #eee",
          paddingTop: "20px",
        }}
      >
        <h2 className={styles.title}>Type of Transportation</h2>

        <div className={styles.wagon__area}>
          <div className={styles.selected}>
            <label className={styles.label}>Transportation type</label>
            <div className={styles.selectWrapper}>
              <Select<OptionType, false>
                value={transportationOptions.find(
                  (option) => option.value === transportationType,
                )}
                onChange={(option: SingleValue<OptionType>) => {
                  const newType = option ? option.value : "";
                  setTransportationType(newType);
                  setWagonType("");
                }}
                options={transportationOptions}
                styles={customStyles}
                isClearable
                placeholder="Select Transportation"
              />
            </div>
          </div>

          {transportationType !== "Multimodal" && (
            <div className={styles.selected}>
              <label className={styles.label}>Wagon type</label>
              <div className={styles.selectWrapper}>
                <Select<OptionType, false>
                  value={wagonOptionsForSelect.find(
                    (option) => option.value === wagonType,
                  )}
                  onChange={(option: SingleValue<OptionType>) => {
                    const newWagonType = option ? option.value : "";
                    setWagonType(newWagonType);
                  }}
                  options={wagonOptionsForSelect}
                  styles={customStyles}
                  placeholder="Select Wagon Type"
                  isClearable
                />
              </div>
            </div>
          )}
        </div>

        {transportationType === "Rail" && (
          <div style={{ margin: "20px 0" }}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                className={styles.custom__checkbox}
                checked={wagonProvision}
                onChange={(e) => setWagonProvision(e.target.checked)}
                style={{ marginRight: "10px" }}
              />
              <span>Request Wagon Provision</span>
            </label>
          </div>
        )}

        {routes.map((route, index) => {
          if (
            transportationType === "Rail" &&
            wagonProvision &&
            titles[index] === "Empty Return Wagon"
          ) {
            return null;
          }
          if (wagonProvision2 && titles[index] === "Empty Return Container") {
            return null;
          }

          return (
            <div key={index} style={{ marginBottom: "20px" }}>
              <h3 className={styles.title} style={{ margin: "20px 0" }}>
                {titles[index]}
              </h3>

              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                {/* FROM */}
                <div
                  className={styles.from}
                  style={{ flex: 1, position: "relative" }}
                >
                  <Input
                    className={styles.input}
                    label="From"
                    placeholder={
                      transportationType === "Rail"
                        ? "Country / City / Station Code"
                        : transportationType === "Sea"
                          ? "Country / City / Port"
                          : "Country / City / Address"
                    }
                    readOnly={false}
                    value={`${route.from.country || "Country"} / ${route.from.city || "City"} / ${
                      transportationType === "Rail"
                        ? route.from.hs || "Station Code"
                        : transportationType === "Sea"
                          ? route.from.port || "Port"
                          : route.from.address || "Address"
                    }`}
                    onChange={(e) =>
                      (transportationType === "Road" ||
                        transportationType === "Multimodal") &&
                      handleFieldChange(
                        index,
                        "from",
                        "address",
                        e.target.value,
                      )
                    }
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === `from-${index}`
                          ? null
                          : `from-${index}`,
                      )
                    }
                  />

                  {openDropdown === `from-${index}` && (
                    <div className={styles.full_dropdown}>
                      <Select<OptionType, false>
                        placeholder="Select Country"
                        options={countries.map((c) => ({
                          value: c.name,
                          label: c.name,
                        }))}
                        value={
                          route.from.country
                            ? {
                                value: route.from.country,
                                label: route.from.country,
                              }
                            : null
                        }
                        onChange={(selected) =>
                          handleCountryChange(
                            index,
                            "from",
                            selected?.value || "",
                          )
                        }
                        styles={customStyles}
                        isClearable
                      />

                      <Select<OptionType, false>
                        placeholder="Select City"
                        options={route.fromCities.map((c) => ({
                          value: c.name,
                          label: c.name,
                        }))}
                        value={
                          route.from.city
                            ? { value: route.from.city, label: route.from.city }
                            : null
                        }
                        onChange={(selected) =>
                          handleFieldChange(
                            index,
                            "from",
                            "city",
                            selected?.value || "",
                          )
                        }
                        styles={customStyles}
                        isClearable
                        isDisabled={!route.from.country}
                      />

                      {transportationType === "Rail" && (
                        <Select<OptionType, false>
                          placeholder="Select Station Code"
                          options={route.fromStationCodes.map((hs) => ({
                            value: hs.value,
                            label: hs.name,
                          }))}
                          value={
                            route.from.hs
                              ? { value: route.from.hs, label: route.from.hs }
                              : null
                          }
                          onChange={(selected) =>
                            handleFieldChange(
                              index,
                              "from",
                              "hs",
                              selected?.value || "",
                            )
                          }
                          styles={customStyles}
                          isClearable
                        />
                      )}

                      {transportationType === "Sea" && (
                        <Select<OptionType, false>
                          placeholder="Select Port"
                          options={route.fromPorts.map((p) => ({
                            value: p.name,
                            label: p.name,
                          }))}
                          value={
                            route.from.port
                              ? {
                                  value: route.from.port,
                                  label: route.from.port,
                                }
                              : null
                          }
                          onChange={(selected) =>
                            handleFieldChange(
                              index,
                              "from",
                              "port",
                              selected?.value || "",
                            )
                          }
                          styles={customStyles}
                          isClearable
                        />
                      )}

                      {(transportationType === "Road" ||
                        transportationType === "Multimodal") && (
                        <Input
                          type="text"
                          className={styles.input}
                          placeholder="Enter Address"
                          value={route.from.address}
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              "from",
                              "address",
                              e.target.value,
                            )
                          }
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* SWAP */}
                <div className={styles.select__3}>
                  <div
                    className={styles.from__to__icon}
                    onClick={() => swapFromTo(index)}
                  >
                    <FromToIcon />
                  </div>
                </div>

                {/* TO */}
                <div
                  className={styles.from}
                  style={{ flex: 1, position: "relative" }}
                >
                  <Input
                    className={styles.input}
                    label="To"
                    placeholder={
                      transportationType === "Sea"
                        ? "Country / City / Port"
                        : transportationType === "Road" ||
                            transportationType === "Multimodal"
                          ? "Country / City / Address"
                          : "Country / City / Station Code"
                    }
                    readOnly={false}
                    value={`${route.to.country || "Country"} / ${route.to.city || "City"} / ${
                      transportationType === "Rail"
                        ? route.to.hs || "Station Code"
                        : transportationType === "Sea"
                          ? route.to.port || "Port"
                          : route.to.address || "Address"
                    }`}
                    onChange={(e) =>
                      (transportationType === "Road" ||
                        transportationType === "Multimodal") &&
                      handleFieldChange(index, "to", "address", e.target.value)
                    }
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === `to-${index}` ? null : `to-${index}`,
                      )
                    }
                  />

                  {openDropdown === `to-${index}` && (
                    <div className={styles.full_dropdown}>
                      <Select<OptionType, false>
                        placeholder="Select Country"
                        options={countries.map((c) => ({
                          value: c.name,
                          label: c.name,
                        }))}
                        value={
                          route.to.country
                            ? {
                                value: route.to.country,
                                label: route.to.country,
                              }
                            : null
                        }
                        onChange={(selected) =>
                          handleCountryChange(
                            index,
                            "to",
                            selected?.value || "",
                          )
                        }
                        styles={customStyles}
                        isClearable
                      />

                      <Select<OptionType, false>
                        placeholder="Select City"
                        options={route.toCities.map((c) => ({
                          value: c.name,
                          label: c.name,
                        }))}
                        value={
                          route.to.city
                            ? { value: route.to.city, label: route.to.city }
                            : null
                        }
                        onChange={(selected) =>
                          handleFieldChange(
                            index,
                            "to",
                            "city",
                            selected?.value || "",
                          )
                        }
                        isDisabled={!route.to.country}
                        styles={customStyles}
                        isClearable
                      />

                      {transportationType === "Rail" && (
                        <Select<OptionType, false>
                          placeholder="Select Station Code"
                          options={route.toStationCodes.map((hs) => ({
                            value: hs.value,
                            label: hs.name,
                          }))}
                          value={
                            route.to.hs
                              ? { value: route.to.hs, label: route.to.hs }
                              : null
                          }
                          onChange={(selected) =>
                            handleFieldChange(
                              index,
                              "to",
                              "hs",
                              selected?.value || "",
                            )
                          }
                          styles={customStyles}
                          isClearable
                        />
                      )}

                      {transportationType === "Sea" && (
                        <Select<OptionType, false>
                          placeholder="Select Port"
                          options={route.toPorts.map((p) => ({
                            value: p.name,
                            label: p.name,
                          }))}
                          value={
                            route.to.port
                              ? { value: route.to.port, label: route.to.port }
                              : null
                          }
                          onChange={(selected) =>
                            handleFieldChange(
                              index,
                              "to",
                              "port",
                              selected?.value || "",
                            )
                          }
                          styles={customStyles}
                          isClearable
                        />
                      )}

                      {(transportationType === "Road" ||
                        transportationType === "Multimodal") && (
                        <Input
                          type="text"
                          className={styles.input}
                          placeholder="Enter Address"
                          value={route.to.address}
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              "to",
                              "address",
                              e.target.value,
                            )
                          }
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PackagingForm;
