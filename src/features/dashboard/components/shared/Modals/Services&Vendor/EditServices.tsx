import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Select, { StylesConfig } from "react-select";

import styles from "@/components/Modal/Modal.module.scss";
import Input from "@/components/Input/Input.tsx";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { formCreator } from "@/libs/form.ts";
import { errorMessageHandler } from "@/libs/error.ts";
import {
  allHsCode,
  EditServices,
  getAllCountry,
  getAllPort,
  getAllServicesName,
  getAllStationCode,
  getAllVendors,
  ServicesData,
} from "@/features/dashboard/services/Services&Vendor/all.service.ts";

interface OptionType {
  value: number | string;
  label: string;
}

interface ServicesProps {
  id: number;
  service: string;
  service_name: string;
  hs_code_id: number;
  country: string;
  form: number;
  to: number;
  transport_mode: string;
  transport_type: string;
  packaging_type: string;
  contract_expired: string | null;
  protocol_expired: string | null;
  purchase_price_unit: string;
  purchase_price_ton: string;
  note: string;
  container_size: number | string;
  container_type: string;
  break_bulk_type: number | string;
  bulk_type: string;
  ownership: string;
  rail_type: string;
  road_type: string;
  sea_type: string;
  vendor: string;
  protocol: string;
  location?: string;
  from_country_id?: number;
  to_country_id?: number;
}

interface VendorType {
  id: number;
  name: string;
  contract_end_date: string;
}

export const customStyles: StylesConfig<OptionType, false> = {
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

interface ComplatedProps {
  modalClose: (isRender: boolean) => void;
  selectedId: number | null;
}

const EditServicesModal = ({ modalClose, selectedId }: ComplatedProps) => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();

  const inputsRef = {
    location: useRef<HTMLInputElement>(null),
    from_id: useRef<HTMLInputElement>(null),
    to_id: useRef<HTMLInputElement>(null),
    purchase_price_unit: useRef<HTMLInputElement>(null),
    purchase_price_ton: useRef<HTMLInputElement>(null),
    contract_experied_date: useRef<HTMLInputElement>(null),
    protocol_experied_date: useRef<HTMLInputElement>(null),
    contract_file: useRef<HTMLInputElement>(null),
    protocol_file: useRef<HTMLInputElement>(null),
    note: useRef<HTMLInputElement>(null),
  };

  const [vendors, setVendors] = useState<VendorType[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<OptionType | null>(null);

  const [hscode, setHsCode] = useState<OptionType[]>([]);
  const [selectedHsCode, setSelectedHsCode] = useState<OptionType | null>(null);

  const [countries, setCountries] = useState<OptionType[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<OptionType | null>(
    null,
  );

  const [transportModes] = useState<OptionType[]>([
    { value: 1, label: "Road" },
    { value: 2, label: "Rail" },
    { value: 3, label: "Sea" },
    { value: 4, label: "Multimodal" },
  ]);
  const [selectedTransportMode, setSelectedTransportMode] =
    useState<OptionType | null>(null);

  const [transportTypes] = useState<OptionType[]>([
    { value: "Container", label: "Container" },
    { value: "Break Bulk", label: "Break Bulk" },
    { value: "Bulk", label: "Bulk" },
    { value: "Oversize cargo", label: "Oversize cargo" },
  ]);
  const [selectedTransportType, setSelectedTransportType] =
    useState<OptionType | null>(null);

  const [stationCodes, setStationCodes] = useState<OptionType[]>([]);
  const [selectedFromStation, setSelectedFromStation] =
    useState<OptionType | null>(null);
  const [selectedToStation, setSelectedToStation] = useState<OptionType | null>(
    null,
  );

  const [ports, setPorts] = useState<OptionType[]>([]);
  const [selectedFromPort, setSelectedFromPort] = useState<OptionType | null>(
    null,
  );
  const [selectedToPort, setSelectedToPort] = useState<OptionType | null>(null);

  const [protocolFileName, setProtocolFileName] = useState<string>("");

  const [serviceNames, setServiceNames] = useState<OptionType[]>([]);
  const [selectedServiceName, setSelectedServiceName] =
    useState<OptionType | null>(null);

  const [selectedFromCountry, setSelectedFromCountry] =
    useState<OptionType | null>(null);

  const [selectedToCountry, setSelectedToCountry] = useState<OptionType | null>(
    null,
  );

  const [containerSizes] = useState<OptionType[]>([
    { value: "20", label: "20" },
    { value: "40", label: "40" },
    { value: "45", label: "45" },
    { value: "other", label: "Other" },
  ]);
  const [selectedContainerSize, setSelectedContainerSize] =
    useState<OptionType | null>(null);

  const [containerTypes] = useState<OptionType[]>([
    { value: "Standart DC", label: "Standart DC" },
    { value: "Standart HC", label: "Standart HC" },
    { value: "Reefer DC", label: "Reefer DC" },
    { value: "Reefer HC", label: "Reefer HC" },
    { value: "Open Top", label: "Open Top" },
    { value: "Flatrack", label: "Flatrack" },
    { value: "Bulk", label: "Bulk" },
    { value: "Flexi Tank", label: "Flexi Tank" },
    { value: "Other", label: "Other" },
  ]);
  const [selectedContainerType, setSelectedContainerType] =
    useState<OptionType | null>(null);

  const [breakBulkTypes] = useState<OptionType[]>([
    { value: "Bag", label: "Bag" },
    { value: "Big Bag", label: "Big Bag" },
    { value: "Box/Crate", label: "Box/Crate" },
    { value: "Pallet", label: "Pallet" },
    { value: "Drums/Barrel", label: "Drums/Barrel" },
    { value: "IBC Tank", label: "IBC Tank" },
    { value: "Other", label: "Other" },
  ]);
  const [selectedBreakBulkType, setSelectedBreakBulkType] =
    useState<OptionType | null>(null);

  const [bulkTypes] = useState<OptionType[]>([
    { value: "Bulk Dry", label: "Bulk Dry" },
    { value: "Bulk Liquid", label: "Bulk Liquid" },
    { value: "Other", label: "Other" },
  ]);
  const [selectedBulkType, setSelectedBulkType] = useState<OptionType | null>(
    null,
  );

  const [ownershipOptions] = useState<OptionType[]>([
    { value: "SOC", label: "SOC" },
    { value: "COC", label: "COC" },
  ]);
  const [selectedOwnership, setSelectedOwnership] = useState<OptionType | null>(
    null,
  );

  const [serviceData, setServiceData] = useState<ServicesProps | null>(null);

  const [railTypes] = useState<OptionType[]>([
    { value: "Covered Wagons", label: "Covered Wagons" },
    { value: "Open Wagons", label: "Open Wagons" },
    { value: "Flat Wagons", label: "Flat Wagons" },
    { value: "Tank Wagons", label: "Tank Wagons" },
    { value: "Hopper Wagons", label: "Hopper Wagons" },
    { value: "Fitting Platform", label: "Fitting Platform" },
  ]);
  const [selectedRailType, setSelectedRailType] = useState<OptionType | null>(
    null,
  );

  const [roadTypes] = useState<OptionType[]>([
    { value: "Container Truck", label: "Container Truck" },
    { value: "Tent Truck", label: "Tent Truck" },
    { value: "Flatbed Truck", label: "Flatbed Truck" },
    { value: "Refrigerated Truck", label: "Refrigerated Truck" },
    { value: "Lowbed Truck", label: "Lowbed Truck" },
    { value: "Car Carrier Truck", label: "Car Carrier Truck" },
  ]);
  const [selectedRoadType, setSelectedRoadType] = useState<OptionType | null>(
    null,
  );

  const [seaTypes] = useState<OptionType[]>([
    { value: "Container Ship", label: "Container Ship" },
    { value: "General Cargo Ship", label: "General Cargo Ship" },
    { value: "Tanker Ship", label: "Tanker Ship" },
    { value: "Roll on/Roll off Ship", label: "Roll on/Roll off Ship" },
    { value: "Bulk Carrier", label: "Bulk Carrier" },
  ]);
  const [selectedSeaType, setSelectedSeaType] = useState<OptionType | null>(
    null,
  );

  useEffect(() => {
    setLoader(true);

    const fetchInitialData = async () => {
      try {
        const [vendorsRes, hsCodeRes, countryRes, serviceNamesRes] =
          await Promise.all([
            getAllVendors(),
            allHsCode(),
            getAllCountry(),
            getAllServicesName(),
          ]);

        if (vendorsRes.status === 200) {
          setVendors(vendorsRes.data);
        }

        if (hsCodeRes.status === 200 && Array.isArray(hsCodeRes.data.data)) {
          const mappedHsCode = hsCodeRes.data.data.map(
            (item: { id: number; cargo: string; code: string }) => ({
              value: item.id,
              label: `${item.cargo} - ${item.code}`,
            }),
          );
          setHsCode(mappedHsCode);
        }

        if (countryRes.status === 200 && Array.isArray(countryRes.data.data)) {
          const mappedCountries = countryRes.data.data.map(
            (country: { id: number; name: string }) => ({
              value: country.id,
              label: country.name,
            }),
          );
          setCountries(mappedCountries);
        }

        if (serviceNamesRes.status === 200) {
          const serviceData = serviceNamesRes.data.data || serviceNamesRes.data;
          if (Array.isArray(serviceData)) {
            const mappedServiceNames = serviceData.map(
              (service: { ID: number; name: string }) => ({
                value: service.ID,
                label: service.name,
              }),
            );
            setServiceNames(mappedServiceNames);
          }
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load initial data");
      }
    };

    fetchInitialData().finally(() => {
      setTimeout(() => setLoader(false), 2500);
    });
  }, []);

  useEffect(() => {
    if (!selectedId) return;

    const fetchServiceData = async () => {
      try {
        const { data, status } = await ServicesData(selectedId);
        if (status === 200) {
          const serviceData = Array.isArray(data) ? data[0] : data;
          setServiceData(serviceData);

          if (serviceData.country) {
            const country = countries.find(
              (c) => c.label === serviceData.country,
            );
            if (country) {
              setSelectedCountry(country);
            }
          }

          // Vendor name'ine göre vendor seçimi
          if (serviceData.vendor) {
            const vendor = vendors.find((v) => v.name === serviceData.vendor);
            if (vendor) {
              setSelectedVendor({
                value: vendor.id,
                label: vendor.name,
              });
            }
          }
        } else {
          console.error("Failed to fetch service data:", status);
          toast.error("Failed to load service data");
        }
      } catch (error) {
        console.error("Error fetching service data:", error);
        toast.error("Error loading service data");
      }
    };

    fetchServiceData();
  }, [selectedId, countries, vendors]);

  useEffect(() => {
    if (!serviceData) return;

    // Text input değerlerini doldur
    if (inputsRef.location.current) {
      inputsRef.location.current.value = serviceData.location || "";
    }

    if (inputsRef.note.current) {
      inputsRef.note.current.value = serviceData.note || "";
    }

    if (inputsRef.purchase_price_unit.current) {
      inputsRef.purchase_price_unit.current.value =
        serviceData.purchase_price_unit || "";
    }

    if (inputsRef.purchase_price_ton.current) {
      inputsRef.purchase_price_ton.current.value =
        serviceData.purchase_price_ton || "";
    }

    // Tarih alanlarını doldur
    if (
      inputsRef.contract_experied_date.current &&
      serviceData.contract_expired
    ) {
      const contractDate = new Date(serviceData.contract_expired);
      inputsRef.contract_experied_date.current.value = contractDate
        .toISOString()
        .split("T")[0];
    }

    if (
      inputsRef.protocol_experied_date.current &&
      serviceData.protocol_expired
    ) {
      const protocolDate = new Date(serviceData.protocol_expired);
      inputsRef.protocol_experied_date.current.value = protocolDate
        .toISOString()
        .split("T")[0];
    }

    // Select değerlerini doldur
    const transportMode = transportModes.find(
      (mode) =>
        mode.label.toLowerCase() === serviceData.transport_mode.toLowerCase(),
    );
    if (transportMode) {
      setSelectedTransportMode(transportMode);
    }

    // Eğer packaging_type varsa onu, yoksa transport_type'ı kullan
    const transportTypeKey =
      serviceData.packaging_type || serviceData.transport_type;
    if (transportTypeKey) {
      const transportType = transportTypes.find(
        (type) => type.label.toLowerCase() === transportTypeKey.toLowerCase(),
      );
      if (transportType) {
        setSelectedTransportType(transportType);
      }
    }

    // Önce service_name'e göre ara, yoksa service'e göre
    let serviceName;
    if (serviceData.service_name) {
      serviceName = serviceNames.find(
        (service) =>
          service.label.toLowerCase() ===
          serviceData.service_name.toLowerCase(),
      );
    }

    if (!serviceName && serviceData.service) {
      serviceName = serviceNames.find(
        (service) =>
          service.label.toLowerCase() === serviceData.service.toLowerCase(),
      );
    }

    if (serviceName) {
      setSelectedServiceName(serviceName);
    }

    if (serviceData.hs_code_id) {
      const hsCodeItem = hscode.find(
        (item) => item.value === serviceData.hs_code_id,
      );
      if (hsCodeItem) {
        setSelectedHsCode(hsCodeItem);
      }
    }

    // Ek alanları doldur
    if (serviceData.container_size) {
      const containerSize = containerSizes.find(
        (size) => size.value === String(serviceData.container_size),
      );
      if (containerSize) {
        setSelectedContainerSize(containerSize);
      }
    }

    if (serviceData.container_type) {
      const containerType = containerTypes.find(
        (type) => type.label === serviceData.container_type,
      );
      if (containerType) {
        setSelectedContainerType(containerType);
      }
    }

    if (serviceData.break_bulk_type) {
      // Eğer break_bulk_type ID ise
      if (typeof serviceData.break_bulk_type === "number") {
        const breakBulkType = breakBulkTypes.find(
          (type) => type.value === serviceData.break_bulk_type,
        );
        if (breakBulkType) {
          setSelectedBreakBulkType(breakBulkType);
        }
      } else {
        const breakBulkType = breakBulkTypes.find(
          (type) => type.label === serviceData.break_bulk_type,
        );
        if (breakBulkType) {
          setSelectedBreakBulkType(breakBulkType);
        }
      }
    }

    if (serviceData.bulk_type) {
      const bulkType = bulkTypes.find(
        (type) => type.label === serviceData.bulk_type,
      );
      if (bulkType) {
        setSelectedBulkType(bulkType);
      }
    }

    if (serviceData.ownership) {
      const ownership = ownershipOptions.find(
        (opt) => opt.label === serviceData.ownership,
      );
      if (ownership) {
        setSelectedOwnership(ownership);
      }
    }

    if (serviceData.rail_type) {
      const railType = railTypes.find(
        (type) => type.label === serviceData.rail_type,
      );
      if (railType) {
        setSelectedRailType(railType);
      }
    }

    if (serviceData.road_type) {
      const roadType = roadTypes.find(
        (type) => type.label === serviceData.road_type,
      );
      if (roadType) {
        setSelectedRoadType(roadType);
      }
    }

    if (serviceData.sea_type) {
      const seaType = seaTypes.find(
        (type) => type.label === serviceData.sea_type,
      );
      if (seaType) {
        setSelectedSeaType(seaType);
      }
    }
  }, [serviceData]);

  useEffect(() => {
    if (!selectedTransportMode || !serviceData) return;

    if (
      selectedTransportMode.label === "Road" ||
      selectedTransportMode.label === "Multimodal"
    ) {
      setTimeout(() => {
        if (inputsRef.from_id.current) {
          inputsRef.from_id.current.value = String(serviceData.form) || "";
        }
        if (inputsRef.to_id.current) {
          inputsRef.to_id.current.value = String(serviceData.to) || "";
        }
      }, 100);
    }
  }, [selectedTransportMode, serviceData]);

  useEffect(() => {
    if (!selectedTransportMode || !serviceData) return;

    if (selectedTransportMode.label === "Multimodal") {
      setStationCodes([]);
      setPorts([]);
      return;
    }

    const transportMode = selectedTransportMode.label;

    const fetchData = async () => {
      try {
        if (transportMode === "Rail") {
          const { data, status } = await getAllStationCode();
          if (status === 200) {
            const mapped = data.map(
              (station: { value: number; name: string }) => ({
                value: station.value,
                label: station.name,
              }),
            );
            setStationCodes(mapped);

            setTimeout(() => {
              const fromStationId = serviceData.form;
              const toStationId = serviceData.to;

              const fromStation = mapped.find(
                (station: OptionType) => station.value === fromStationId,
              );
              const toStation = mapped.find(
                (station: OptionType) => station.value === toStationId,
              );

              if (fromStation) setSelectedFromStation(fromStation);
              if (toStation) setSelectedToStation(toStation);
            }, 100);
          }
        } else if (transportMode === "Sea") {
          const { data, status } = await getAllPort();
          if (status === 200) {
            const mapped =
              data?.data?.map((port: { id: number; name: string }) => ({
                value: port.id,
                label: port.name,
              })) || [];
            setPorts(mapped);

            setTimeout(() => {
              const fromPortId = serviceData.form;
              const toPortId = serviceData.to;

              const fromPort = mapped.find(
                (port: OptionType) => port.value === fromPortId,
              );
              const toPort = mapped.find(
                (port: OptionType) => port.value === toPortId,
              );

              if (fromPort) setSelectedFromPort(fromPort);
              if (toPort) setSelectedToPort(toPort);
            }, 100);
          }
        }
      } catch (error) {
        console.error("Error fetching station/port data:", error);
      }
    };

    fetchData().finally(() => {});
  }, [selectedTransportMode, serviceData]);

  const handleFileChangeProtocol = () => {
    const file = inputsRef.protocol_file.current?.files?.[0];
    if (file) setProtocolFileName(file.name);
  };

  const handleVendorChange = (selectedOption: OptionType | null) => {
    setSelectedVendor(selectedOption);

    if (selectedOption && inputsRef.contract_experied_date.current) {
      const selectedVendorData = vendors.find(
        (vendor) => vendor.id === Number(selectedOption.value),
      );

      if (selectedVendorData && selectedVendorData.contract_end_date) {
        const dateParts = selectedVendorData.contract_end_date.split("-");
        if (dateParts.length === 3) {
          const [day, month, year] = dateParts;
          const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
          inputsRef.contract_experied_date.current.value = formattedDate;
        }
      }
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedId) {
      toast.error("ID for the Select is missing");
      return;
    }

    setLoader(true);

    const formData = formCreator([
      { name: "vendor_id", data: selectedVendor?.value || null },
      { name: "service_name", data: selectedServiceName?.label || null },
      { name: "location", data: inputsRef.location.current?.value },
      { name: "hs_code_id", data: selectedHsCode?.value || null },
      { name: "country_id", data: selectedCountry?.value || null },
      {
        name: "from_id",
        data:
          selectedTransportMode?.label === "Road" ||
          selectedTransportMode?.label === "Multimodal"
            ? inputsRef.from_id.current?.value
            : selectedTransportMode?.label === "Rail"
              ? selectedFromStation?.value
              : selectedFromPort?.value,
      },
      {
        name: "to_id",
        data:
          selectedTransportMode?.label === "Road" ||
          selectedTransportMode?.label === "Multimodal"
            ? inputsRef.to_id.current?.value
            : selectedTransportMode?.label === "Rail"
              ? selectedToStation?.value
              : selectedToPort?.value,
      },
      {
        name: "from_country_id",
        data: selectedFromCountry?.value || null,
      },
      {
        name: "to_country_id",
        data: selectedToCountry?.value || null,
      },
      { name: "packaging_type", data: selectedTransportType?.label || null },
      { name: "transport_mode", data: selectedTransportMode?.label || null },
      {
        name: "contract_experied_date",
        data: inputsRef.contract_experied_date.current?.value
          ? new Date(
              inputsRef.contract_experied_date.current.value,
            ).toISOString()
          : null,
      },
      {
        name: "protocol_experied_date",
        data: inputsRef.protocol_experied_date.current?.value
          ? new Date(
              inputsRef.protocol_experied_date.current.value,
            ).toISOString()
          : null,
      },
      {
        name: "purchase_price_unit",
        data: inputsRef.purchase_price_unit.current?.value,
      },
      {
        name: "purchase_price_ton",
        data: inputsRef.purchase_price_ton.current?.value,
      },
      {
        name: "protocol_file",
        data: inputsRef.protocol_file.current?.files?.[0],
      },
      { name: "note", data: inputsRef.note.current?.value },
      { name: "container_size", data: selectedContainerSize?.value || null },
      { name: "container_type", data: selectedContainerType?.label || null },
      { name: "break_bulk_type", data: selectedBreakBulkType?.label || null },
      { name: "bulk_type", data: selectedBulkType?.label || null },
      { name: "ownership", data: selectedOwnership?.label || null },
      { name: "rail_type", data: selectedRailType?.label || null },
      { name: "road_type", data: selectedRoadType?.label || null },
      { name: "sea_type", data: selectedSeaType?.label || null },
    ]);

    const { status, data } = await EditServices(formData, selectedId);
    if (status === 200) {
      toast.success(errorMessageHandler(data));
    } else {
      toast.error(errorMessageHandler(data));
    }

    setLoader(false);
    modalClose(true);
  };

  const renderTransportTypeOptions = () => {
    if (!selectedTransportType) return null;

    switch (selectedTransportType.label) {
      case "Container":
        return (
          <>
            <div className={styles.selectWrapper}>
              <label className={styles.label}>Container Size</label>
              <Select
                options={containerSizes}
                value={selectedContainerSize}
                onChange={setSelectedContainerSize}
                styles={customStyles}
                placeholder="Select Container Size"
                isSearchable
                isClearable
              />
            </div>
            <div className={styles.selectWrapper}>
              <label className={styles.label}>Container Type</label>
              <Select
                options={containerTypes}
                value={selectedContainerType}
                onChange={setSelectedContainerType}
                styles={customStyles}
                placeholder="Select Container Type"
                isSearchable
                isClearable
              />
            </div>
          </>
        );
      case "Break Bulk":
        return (
          <div className={styles.selectWrapper}>
            <label className={styles.label}>Break Bulk Type</label>
            <Select
              options={breakBulkTypes}
              value={selectedBreakBulkType}
              onChange={setSelectedBreakBulkType}
              styles={customStyles}
              placeholder="Select Break Bulk Type"
              isSearchable
              isClearable
            />
          </div>
        );
      case "Bulk":
        return (
          <div className={styles.selectWrapper}>
            <label className={styles.label}>Bulk Type</label>
            <Select
              options={bulkTypes}
              value={selectedBulkType}
              onChange={setSelectedBulkType}
              styles={customStyles}
              placeholder="Select Bulk Type"
              isSearchable
              isClearable
            />
          </div>
        );
      case "Oversize cargo":
        return null;
      default:
        return null;
    }
  };

  const renderTransportModeType = () => {
    if (!selectedTransportMode) return null;

    switch (selectedTransportMode.label) {
      case "Rail":
        return (
          <div className={styles.selectWrapper}>
            <label className={styles.label}>Type</label>
            <Select
              options={railTypes}
              value={selectedRailType}
              onChange={setSelectedRailType}
              styles={customStyles}
              placeholder="Select Rail Type"
              isSearchable
              isClearable
            />
          </div>
        );
      case "Road":
        return (
          <div className={styles.selectWrapper}>
            <label className={styles.label}>Type</label>
            <Select
              options={roadTypes}
              value={selectedRoadType}
              onChange={setSelectedRoadType}
              styles={customStyles}
              placeholder="Select Road Type"
              isSearchable
              isClearable
            />
          </div>
        );
      case "Sea":
        return (
          <div className={styles.selectWrapper}>
            <label className={styles.label}>Type</label>
            <Select
              options={seaTypes}
              value={selectedSeaType}
              onChange={setSelectedSeaType}
              styles={customStyles}
              placeholder="Select Sea Type"
              isSearchable
              isClearable
            />
          </div>
        );
      case "Multimodal":
        return null;
      default:
        return null;
    }
  };

  return (
    <Modal
      title={t("services.modals.title_services")}
      modalClose={() => modalClose(false)}
    >
      <form
        className={`${styles.form} ${styles.createServicesGrid}`}
        onSubmit={handleSubmit}
      >
        <div className={styles.form__inputs}>
          <div className={styles.all}>
            <div className={styles.left}>
              <div className={styles.flex__mode}>
                <div className={styles.selectWrapper}>
                  <label className={styles.label}>Select Vendor</label>
                  <Select
                    options={vendors.map((vendor) => ({
                      value: vendor.id,
                      label: vendor.name,
                      contract_end_date: vendor.contract_end_date,
                    }))}
                    value={selectedVendor}
                    onChange={handleVendorChange}
                    styles={customStyles}
                    placeholder={t("services.modals.create.value")}
                    isSearchable
                    required
                    isClearable
                  />
                </div>

                <div className={styles.selectWrapper}>
                  <label className={styles.label}>
                    {t("services.modals.create.service_name")}
                  </label>
                  <Select
                    options={serviceNames}
                    value={selectedServiceName}
                    onChange={setSelectedServiceName}
                    styles={customStyles}
                    placeholder={t("services.modals.create.service_name")}
                    isSearchable
                    required
                    isClearable
                  />
                </div>
              </div>

              <div className={styles.flex__row}>
                <div className={styles.selectWrapper}>
                  <label className={styles.label}>
                    {t("services.modals.create.hs_code")}
                  </label>
                  <Select
                    options={hscode}
                    value={selectedHsCode}
                    onChange={setSelectedHsCode}
                    styles={customStyles}
                    placeholder={t(
                      "services.modals.create.hs_code_placeholder",
                    )}
                    isSearchable
                    isClearable
                  />
                </div>

                <div className={styles.selectWrapper}>
                  <label className={styles.label}>
                    {t("services.modals.create.select_country")}
                  </label>
                  <Select
                    options={countries}
                    value={selectedCountry}
                    onChange={setSelectedCountry}
                    styles={customStyles}
                    placeholder={t("services.modals.create.value")}
                    isSearchable
                    required
                    isClearable
                  />
                </div>
                <div className={styles.selectWrapper}>
                  <label className={styles.label}>Ownership</label>
                  <Select
                    options={ownershipOptions}
                    value={selectedOwnership}
                    onChange={setSelectedOwnership}
                    styles={customStyles}
                    placeholder="Select Ownership"
                    isSearchable
                    isClearable
                  />
                </div>
              </div>

              <div className={styles.selectWrapper}>
                <label className={styles.label}>
                  {t("services.modals.create.transport__mode")}
                </label>
                <Select
                  options={transportModes}
                  value={selectedTransportMode}
                  onChange={setSelectedTransportMode}
                  styles={customStyles}
                  placeholder={t("services.modals.create.value")}
                  isSearchable
                  required
                  isClearable
                />
              </div>

              <div className={styles.flex__mode}>
                {renderTransportModeType()}
              </div>

              <div className={styles.flex__mode}>
                {selectedTransportMode?.label === "Road" ||
                selectedTransportMode?.label === "Multimodal" ? (
                  <>
                    <div className={styles.selectWrapper}>
                      <Input
                        label={
                          selectedTransportMode?.label === "Multimodal"
                            ? "From Address"
                            : "From"
                        }
                        type="text"
                        inputRef={inputsRef.from_id}
                        placeholder={
                          selectedTransportMode?.label === "Multimodal"
                            ? "From address"
                            : "From location"
                        }
                      />
                    </div>
                    <div className={styles.selectWrapper}>
                      <Input
                        type="text"
                        label={
                          selectedTransportMode?.label === "Multimodal"
                            ? "To Address"
                            : "To"
                        }
                        inputRef={inputsRef.to_id}
                        placeholder={
                          selectedTransportMode?.label === "Multimodal"
                            ? "To address"
                            : "To location"
                        }
                      />
                    </div>
                  </>
                ) : selectedTransportMode?.label === "Rail" ? (
                  <>
                    <div className={styles.selectWrapper}>
                      <label className={styles.label}>From Station</label>
                      <Select
                        options={stationCodes}
                        value={selectedFromStation}
                        onChange={setSelectedFromStation}
                        styles={customStyles}
                        placeholder="Select From Station"
                        isSearchable
                        isClearable
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        menuShouldScrollIntoView={false}
                      />
                    </div>
                    <div className={styles.selectWrapper}>
                      <label className={styles.label}>To Station</label>
                      <Select
                        options={stationCodes}
                        value={selectedToStation}
                        onChange={setSelectedToStation}
                        styles={customStyles}
                        placeholder="Select To Station"
                        isSearchable
                        isClearable
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        menuShouldScrollIntoView={false}
                      />
                    </div>
                  </>
                ) : selectedTransportMode?.label === "Sea" ? (
                  <>
                    <div className={styles.selectWrapper}>
                      <label className={styles.label}>From Port</label>
                      <Select
                        options={ports}
                        value={selectedFromPort}
                        onChange={setSelectedFromPort}
                        styles={customStyles}
                        placeholder="Select From Port"
                        isSearchable
                        isClearable
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        menuShouldScrollIntoView={false}
                      />
                    </div>
                    <div className={styles.selectWrapper}>
                      <label className={styles.label}>To Port</label>
                      <Select
                        options={ports}
                        value={selectedToPort}
                        onChange={setSelectedToPort}
                        styles={customStyles}
                        placeholder="Select To Port"
                        isSearchable
                        isClearable
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        menuShouldScrollIntoView={false}
                      />
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            <div className={styles.right}>
              <div className={styles.flex__mode}>
                <div className={styles.selectWrapper}>
                  <label className={styles.label}>From Country</label>
                  <Select
                    options={countries}
                    value={selectedFromCountry}
                    onChange={setSelectedFromCountry}
                    styles={customStyles}
                    placeholder="Select from country"
                    isSearchable
                    isClearable
                  />
                </div>

                <div className={styles.selectWrapper}>
                  <label className={styles.label}>To Country</label>
                  <Select
                    options={countries}
                    value={selectedToCountry}
                    onChange={setSelectedToCountry}
                    styles={customStyles}
                    placeholder="Select to country"
                    isSearchable
                    isClearable
                  />
                </div>
              </div>

              <div className={styles.flex__row}>
                <div className={styles.selectWrapper}>
                  <label className={styles.label}>
                    {t("services.modals.create.transport__type")}
                  </label>
                  <Select
                    options={transportTypes}
                    value={selectedTransportType}
                    onChange={setSelectedTransportType}
                    styles={customStyles}
                    placeholder={t("services.modals.create.value")}
                    isSearchable
                    required
                    isClearable
                  />
                </div>
              </div>

              <div className={styles.flex__mode}>
                {renderTransportTypeOptions()}
              </div>

              <div className={styles.flex__mode}>
                <Input
                  type="date"
                  label={t("services.modals.create.contract__date")}
                  inputRef={inputsRef.contract_experied_date}
                  autoComplete="off"
                />

                <Input
                  type="date"
                  label={t("services.modals.create.protocol__date")}
                  inputRef={inputsRef.protocol_experied_date}
                  autoComplete="off"
                />
              </div>

              <div className={styles.flex__mode}>
                <Input
                  type="text"
                  label={t("services.modals.create.per__unit")}
                  placeholder={t("services.modals.create.value")}
                  inputRef={inputsRef.purchase_price_unit}
                  autoComplete="off"
                />
                <Input
                  type="text"
                  label={t("services.modals.create.per__ton")}
                  placeholder={t("services.modals.create.value")}
                  inputRef={inputsRef.purchase_price_ton}
                  autoComplete="off"
                />
              </div>

              <Input
                type="text"
                label={t("services.modals.create.location")}
                placeholder={t("services.modals.create.location")}
                inputRef={inputsRef.location}
                autoComplete="off"
              />

              <div className={styles.dropzone}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <span>{t("services.modals.create.upload__file")}</span>
                  <label
                    htmlFor="protocol-file-upload"
                    className={styles.dropzone__label}
                    style={{ height: "54px" }}
                  >
                    {protocolFileName ||
                      t("services.modals.create.file__placeholder")}
                  </label>
                  <input
                    type="file"
                    id="protocol-file-upload"
                    ref={inputsRef.protocol_file}
                    onChange={handleFileChangeProtocol}
                    className={styles.dropzone__input}
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  />
                </div>
              </div>
              <Input
                type="text"
                label="Note"
                placeholder="Note"
                inputRef={inputsRef.note}
                autoComplete="off"
              />
            </div>
          </div>
        </div>

        <div className={styles.form__buttons}>
          <Button
            text={t("shared.buttons.cancel")}
            type="button"
            onClick={() => modalClose(false)}
          />
          <Button text={t("shared.buttons.save")} type="submit" />
        </div>
      </form>
    </Modal>
  );
};

export default EditServicesModal;
