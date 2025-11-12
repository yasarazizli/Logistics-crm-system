import styles from "@/components/Modal/Modal.module.scss";
import React, { useState, useEffect } from "react";
import Input from "@/components/Input/Input.tsx";
import {
  GetAllCity,
  GetAllCountry,
  GetAllPort,
  GetAllStationCode,
} from "@/features/dashboard/services/PriceQuotation/pricequotation.services.ts";
import { FromToIcon } from "@/assets/icons/shared.vectors.tsx";
import Select, { SingleValue, StylesConfig } from "react-select";

export interface PackagingData {
  package_type: string;
  packing_type?: string;
  size?: number;
  total_quantity: number;
  net_weight: number;
  gross_weight: number;
  width?: number;
  height?: number;
  length?: number;
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

  const titles = [
    "Full route",
    "Requested route",
    "Empty Return Container",
    "Empty Return Wagon",
  ];

  // Transportation type dəyişdikdə routes-ları sıfırla
  useEffect(() => {
    setRoutes([
      {
        from: { country: "", city: "", hs: "", address: "", port: "" },
        to: { country: "", city: "", hs: "", address: "", port: "" },
        fromCities: [],
        toCities: [],
        fromStationCodes: [],
        toStationCodes: [],
        fromPorts: [],
        toPorts: [],
      },
      {
        from: { country: "", city: "", hs: "", address: "", port: "" },
        to: { country: "", city: "", hs: "", address: "", port: "" },
        fromCities: [],
        toCities: [],
        fromStationCodes: [],
        toStationCodes: [],
        fromPorts: [],
        toPorts: [],
      },
      {
        from: { country: "", city: "", hs: "", address: "", port: "" },
        to: { country: "", city: "", hs: "", address: "", port: "" },
        fromCities: [],
        toCities: [],
        fromStationCodes: [],
        toStationCodes: [],
        fromPorts: [],
        toPorts: [],
      },
      {
        from: { country: "", city: "", hs: "", address: "", port: "" },
        to: { country: "", city: "", hs: "", address: "", port: "" },
        fromCities: [],
        toCities: [],
        fromStationCodes: [],
        toStationCodes: [],
        fromPorts: [],
        toPorts: [],
      },
    ]);
  }, [transportationType]);

  // Wagon type dəyişdikdə parent komponentə bildir
  useEffect(() => {
    if (onWagonTypeChange) onWagonTypeChange(wagonType);
  }, [wagonType, onWagonTypeChange]);

  // Transportation type dəyişdikdə parent komponentə bildir
  useEffect(() => {
    if (onTransportationTypeChange) {
      onTransportationTypeChange(transportationType);
    }
  }, [transportationType, onTransportationTypeChange]);

  // Transportation type dəyişdikdə wagon type-i sıfırla
  useEffect(() => {
    setWagonType("");
  }, [transportationType]);

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

  useEffect(() => {
    if (onStackableChange) {
      onStackableChange(showPackingTypeInput);
    }
  }, [showPackingTypeInput, onStackableChange]);

  useEffect(() => {
    if (onInRowChange) {
      onInRowChange(parseInt(packingType) || 0);
    }
  }, [packingType, onInRowChange]);

  useEffect(() => {
    if (onContainerProvisionChange) {
      onContainerProvisionChange(wagonProvision2);
    }
  }, [wagonProvision2, onContainerProvisionChange]);

  useEffect(() => {
    if (onWagonProvisionChange) {
      onWagonProvisionChange(wagonProvision);
    }
  }, [wagonProvision, onWagonProvisionChange]);

  const handleContainerInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setContainerInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBreakBulkInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setBreakBulkInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBulkLiquidInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setBulkLiquidInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGeneralInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGeneralInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePackingTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPackingType(e.target.value);
  };

  const handlePackingTypeCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setShowPackingTypeInput(e.target.checked);
    if (!e.target.checked) {
      setPackingType("");
    }
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
        package_type: "Container",
        packing_type: selectedTypeLabel,
        size: parseInt(selectedOption2) || 0,
        total_quantity: parseInt(containerInputs.totalQuantity) || 0,
        net_weight: parseFloat(containerInputs.netWeight) || 0,
        gross_weight: parseFloat(containerInputs.grossWeight) || 0,
      };
    } else if (selectedOption1 === "Break_Bulk") {
      packagingData = {
        package_type: "Break_Bulk",
        packing_type: selectedTypeLabel,
        total_quantity: parseInt(breakBulkInputs.totalQuantity) || 0,
        net_weight: parseFloat(breakBulkInputs.netWeight) || 0,
        gross_weight: parseFloat(breakBulkInputs.grossWeight) || 0,
        width: parseFloat(breakBulkInputs.width) || 0,
        height: parseFloat(breakBulkInputs.height) || 0,
        length: parseFloat(breakBulkInputs.length) || 0,
      };
    } else if (
      selectedOption1 === "Bulk" &&
      selectedOption3 === "Bulk Liquid"
    ) {
      packagingData = {
        package_type: "Bulk_Liquid",
        packing_type: selectedTypeLabel,
        net_weight: parseFloat(bulkLiquidInputs.netWeight) || 0,
        total_quantity: 0,
        gross_weight: 0,
      };
    } else if (selectedOption1 === "Oversize_Cargo") {
      packagingData = {
        package_type: "Oversize_Cargo",
        total_quantity: parseInt(generalInputs.totalQuantity) || 0,
        net_weight: parseFloat(generalInputs.netWeight) || 0,
        gross_weight: parseFloat(generalInputs.grossWeight) || 0,
        width: parseFloat(generalInputs.width) || 0,
        height: parseFloat(generalInputs.height) || 0,
        length: parseFloat(generalInputs.length) || 0,
      };
    } else {
      packagingData = {
        package_type: selectedOption1,
        packing_type: selectedTypeLabel,
        total_quantity: parseInt(generalInputs.totalQuantity) || 0,
        net_weight: parseFloat(generalInputs.netWeight) || 0,
        gross_weight: parseFloat(generalInputs.grossWeight) || 0,
        width: parseFloat(generalInputs.width) || 0,
        height: parseFloat(generalInputs.height) || 0,
        length: parseFloat(generalInputs.length) || 0,
      };
    }

    onDataChange(packagingData);
  };

  const swapFromTo = (index: number) => {
    setRoutes((prev) => {
      const newRoutes = [...prev];
      const route = newRoutes[index];
      newRoutes[index] = {
        ...route,
        from: { ...route.to },
        to: { ...route.from },
        fromCities: [...route.toCities],
        toCities: [...route.fromCities],
        fromStationCodes: [...route.toStationCodes],
        toStationCodes: [...route.fromStationCodes],
        fromPorts: [...route.toPorts],
        toPorts: [...route.fromPorts],
      };
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
        country: country,
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

      // YALNIZ ölkə dəyişəndə sıfırlama et
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
      } else {
        // Digər field-lər üçün sadəcə dəyəri yenilə
        updated[index][type][field] = value;
      }

      return [...updated];
    });
  };

  const findOptionIgnoreCase = (options: OptionType[], value: string) => {
    if (!value) return null;
    return options.find(
      (option) => option.value.toLowerCase() === value.toLowerCase(),
    );
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
      "&:hover": {
        border: "1px solid #E7E7E7",
      },
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
      ":hover": {
        color: "#000",
      },
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
      ":active": {
        backgroundColor: "#1D736B",
        color: "white",
      },
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

  const wagonOptions = {
    Rail: [
      { value: "Covered Wagons", label: "Covered Wagons" },
      { value: "Open Wagons", label: "Open Wagons" },
      { value: "Flat Wagons", label: "Flat Wagons" },
      { value: "Tank Wagons", label: "Tank Wagons" },
      { value: "Hopper Wagons", label: "Hopper Wagons" },
      { value: "Fitting Platform", label: "Fitting Platform" },
    ],
    Road: [
      { value: "Container Truck", label: "Container Truck" },
      { value: "Tent Truck", label: "Tent Truck" },
      { value: "Flatbed Truck", label: "Flatbed Truck" },
      { value: "Refrigerated Truck", label: "Refrigerated Truck" },
      { value: "Lowbed Truck", label: "Lowbed Truck" },
      { value: "Car Carrier Truck", label: "Car Carrier Truck" },
    ],
    Sea: [
      { value: "Container Ship", label: "Container Ship" },
      { value: "General Cargo Ship", label: "General Cargo Ship" },
      { value: "Tanker Ship", label: "Tanker Ship" },
      { value: "Roll on/Roll off Ship", label: "Roll on/Roll off Ship" },
      { value: "Bulk Carrier", label: "Bulk Carrier" },
    ],
    Multimodal: [],
  };

  const wagonOptionsForSelect: OptionType[] =
    wagonOptions[transportationType as keyof typeof wagonOptions] || [];

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

  const formatDisplayValue = (
    route: (typeof routes)[0],
    type: "from" | "to",
  ) => {
    const location = route[type];
    const parts = [];

    if (location.country) parts.push(location.country);
    if (location.city) parts.push(location.city);

    if (transportationType === "Rail" && location.hs) {
      const stationCodes =
        type === "from" ? route.fromStationCodes : route.toStationCodes;
      const station = stationCodes.find(
        (s) => s.value.toString() === location.hs,
      );
      parts.push(station ? station.name : location.hs);
    } else if (transportationType === "Sea" && location.port) {
      parts.push(location.port);
    } else if (
      (transportationType === "Road" || transportationType === "Multimodal") &&
      location.address
    ) {
      parts.push(location.address);
    }

    return parts.length > 0 ? parts.join(" / ") : "";
  };

  const handleDropdownOpen = async (type: "from" | "to", index: number) => {
    const route = routes[index];
    const location = type === "from" ? route.from : route.to;

    if (location.country) {
      const hasData =
        (type === "from" && route.fromCities.length === 0) ||
        (type === "to" && route.toCities.length === 0);

      if (hasData) {
        const [citiesRes, stationCodesRes, portsRes] = await Promise.all([
          GetAllCity(location.country),
          GetAllStationCode(location.country),
          GetAllPort(location.country),
        ]);

        setRoutes((prev) => {
          const updated = [...prev];
          if (type === "from") {
            updated[index].fromCities = citiesRes?.data || [];
            updated[index].fromStationCodes = stationCodesRes?.data || [];
            updated[index].fromPorts = portsRes?.data?.data || [];
          } else {
            updated[index].toCities = citiesRes?.data || [];
            updated[index].toStationCodes = stationCodesRes?.data || [];
            updated[index].toPorts = portsRes?.data?.data || [];
          }
          return updated;
        });
      }
    }

    setOpenDropdown(
      openDropdown === `${type}-${index}` ? null : `${type}-${index}`,
    );
  };

  const handleStationCodeChange = (
    index: number,
    type: "from" | "to",
    selected: SingleValue<OptionType>,
  ) => {
    const value = selected?.value || "";

    setRoutes((prev) => {
      const updated = [...prev];
      updated[index][type].hs = value;
      return updated;
    });
  };

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
                  value={
                    findOptionIgnoreCase(wagonOptionsForSelect, wagonType) ||
                    null
                  }
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
                    readOnly={true}
                    value={formatDisplayValue(route, "from")}
                    onClick={() => handleDropdownOpen("from", index)}
                  />

                  {openDropdown === `from-${index}` && (
                    <div className={styles.full_dropdown}>
                      {/* Country */}
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

                      {/* City */}
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

                      {/* HS / Port / Address */}
                      {transportationType === "Rail" && (
                        <Select<OptionType, false>
                          placeholder="Select Station Code"
                          options={route.fromStationCodes.map((hs) => ({
                            value: hs.value.toString(),
                            label: hs.name,
                          }))}
                          value={
                            route.from.hs
                              ? {
                                  value: route.from.hs,
                                  label:
                                    route.fromStationCodes.find(
                                      (s) =>
                                        s.value.toString() === route.from.hs,
                                    )?.name || route.from.hs,
                                }
                              : null
                          }
                          onChange={(selected) => {
                            handleStationCodeChange(index, "from", selected);
                          }}
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
                      transportationType === "Rail"
                        ? "Country / City / Station Code"
                        : transportationType === "Sea"
                          ? "Country / City / Port"
                          : "Country / City / Address"
                    }
                    readOnly={true}
                    value={formatDisplayValue(route, "to")}
                    onClick={() => handleDropdownOpen("to", index)}
                  />

                  {openDropdown === `to-${index}` && (
                    <div className={styles.full_dropdown}>
                      {/* Country */}
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

                      {/* City */}
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

                      {/* HS / Port / Address */}
                      {transportationType === "Rail" && (
                        <Select<OptionType, false>
                          placeholder="Select Station Code"
                          options={route.toStationCodes.map((hs) => ({
                            value: hs.value.toString(),
                            label: hs.name,
                          }))}
                          value={
                            route.to.hs
                              ? {
                                  value: route.to.hs,
                                  label:
                                    route.toStationCodes.find(
                                      (s) => s.value.toString() === route.to.hs,
                                    )?.name || route.to.hs,
                                }
                              : null
                          }
                          onChange={(selected) => {
                            handleStationCodeChange(index, "to", selected);
                          }}
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
