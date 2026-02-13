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
  getAllCountry,
  getAllPort,
  getAllServicesData,
  getAllServicesName,
  getAllStationCode,
  getAllVendors,
} from "@/features/dashboard/services/Services&Vendor/all.service.ts";
import { AddCompletedRequest } from "@/features/dashboard/services/BuyersManager/manager.service.ts";

interface OptionType {
  value: number | string;
  label: string;
}

interface ServicesProps {
  buyers: string;
  from: number | string;
  from_country_id: number | null;
  hs_code: number;
  id: number;
  location: string;
  note: string;
  service: string;
  to: number | string;
  to_country_id: number | null;
  transport_mode: string;
  transport_type: string;
  country_id?: number;
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
    minHeight: "53px",
    height: "auto",
    fontFamily: "Manrope",
    fontSize: "14px",
    fontWeight: 500,
    boxShadow: "none",
    color: "#7b7979",
    alignItems: "center",
    "&:hover": {
      border: "1px solid #E7E7E7",
    },
  }),

  valueContainer: (provided) => ({
    ...provided,
    padding: "0 8px",
    overflow: "visible",
  }),

  input: (provided) => ({
    ...provided,
    margin: 0,
    padding: 0,
    color: "#000",
    lineHeight: "10px",
  }),

  singleValue: (provided) => ({
    ...provided,
    color: "#000",
    lineHeight: "20px",
    paddingBottom: "2px",
  }),

  placeholder: (provided) => ({
    ...provided,
    color: "rgba(0,0,0,0.48)",
    lineHeight: "20px",
  }),

  clearIndicator: (p) => ({
    ...p,
    cursor: "pointer",
    color: "#000",
  }),

  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: () => ({ display: "none" }),

  menu: (p) => ({ ...p, zIndex: 9999 }),
  menuPortal: (p) => ({ ...p, zIndex: 9999 }),

  option: (p, state) => ({
    ...p,
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
  }),
};

interface ComplatedProps {
  modalClose: (isRender: boolean) => void;
  selectedId: number | null;
}

const CreateQuotation = ({ modalClose, selectedId }: ComplatedProps) => {
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

  const [isContractActive, setIsContractActive] = useState(false);

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
    { value: "Swap Body", label: "Swap Body" },
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
        const { data, status } = await getAllServicesData(selectedId);
        if (status === 200) {
          const serviceData = Array.isArray(data) ? data[0] : data;
          setServiceData(serviceData);

          if (serviceData.country_id) {
            const country = countries.find(
              (c) => c.value === serviceData.country_id,
            );
            if (country) {
              setSelectedCountry(country);
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
  }, [selectedId, countries]);

  useEffect(() => {
    if (!serviceData) return;

    if (inputsRef.location.current) {
      inputsRef.location.current.value = serviceData.location || "";
    }

    if (inputsRef.note.current) {
      inputsRef.note.current.value = serviceData.note || "";
    }

    const transportMode = transportModes.find(
      (mode) =>
        mode.label.toLowerCase() === serviceData.transport_mode.toLowerCase(),
    );
    if (transportMode) {
      setSelectedTransportMode(transportMode);
    }

    const transportType = transportTypes.find(
      (type) =>
        type.label.toLowerCase() === serviceData.transport_type.toLowerCase(),
    );
    if (transportType) {
      setSelectedTransportType(transportType);
    }

    const serviceName = serviceNames.find(
      (service) =>
        service.label.toLowerCase() === serviceData.service.toLowerCase(),
    );
    if (serviceName) {
      setSelectedServiceName(serviceName);
    }

    if (serviceData.hs_code) {
      const hsCodeItem = hscode.find(
        (item) => item.value === serviceData.hs_code,
      );
      if (hsCodeItem) {
        setSelectedHsCode(hsCodeItem);
      }
    }

    if (serviceData.from_country_id) {
      const fromCountry = countries.find(
        (country) => country.value === serviceData.from_country_id,
      );
      if (fromCountry) {
        setSelectedFromCountry(fromCountry);
      }
    }

    if (serviceData.to_country_id) {
      const toCountry = countries.find(
        (country) => country.value === serviceData.to_country_id,
      );
      if (toCountry) {
        setSelectedToCountry(toCountry);
      }
    }
  }, [serviceData]);

  useEffect(() => {
    if (!selectedTransportMode || !serviceData) return;

    if (selectedTransportMode.label === "Road") {
      setTimeout(() => {
        if (inputsRef.from_id.current) {
          inputsRef.from_id.current.value = String(serviceData.from) || "";
        }
        if (inputsRef.to_id.current) {
          inputsRef.to_id.current.value = String(serviceData.to) || "";
        }
      }, 100);
    }

    if (selectedTransportMode.label === "Multimodal") {
      setTimeout(() => {
        if (inputsRef.from_id.current) {
          inputsRef.from_id.current.value = String(serviceData.from) || "";
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
              const fromStationId =
                typeof serviceData.from === "number"
                  ? serviceData.from
                  : Number(serviceData.from);
              const toStationId =
                typeof serviceData.to === "number"
                  ? serviceData.to
                  : Number(serviceData.to);

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
              const fromPortId =
                typeof serviceData.from === "number"
                  ? serviceData.from
                  : Number(serviceData.from);
              const toPortId =
                typeof serviceData.to === "number"
                  ? serviceData.to
                  : Number(serviceData.to);

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

  const create = async (event: FormEvent) => {
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
        name: "is_protocol_active",
        data: isContractActive,
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

    const { status, data } = await AddCompletedRequest(formData, selectedId);
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
        onSubmit={create}
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

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                  }}
                >
                  <Input
                    type="date"
                    label={t("services.modals.create.protocol__date")}
                    inputRef={inputsRef.protocol_experied_date}
                    autoComplete="off"
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginTop: 20,
                    }}
                  >
                    <div
                      onClick={() => setIsContractActive(!isContractActive)}
                      style={{
                        width: 50,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: isContractActive ? "#4CAF50" : "#ccc",
                        position: "relative",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 2,
                          left: isContractActive ? 28 : 2,
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          backgroundColor: "white",
                          transition: "all 0.3s ease",
                        }}
                      />
                    </div>
                  </div>
                </div>
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
                    accept="*/*"
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
            viewType="red"
            onClick={() => modalClose(false)}
          />
          <Button text={t("shared.buttons.save")} type="submit" />
        </div>
      </form>
    </Modal>
  );
};

export default CreateQuotation;
