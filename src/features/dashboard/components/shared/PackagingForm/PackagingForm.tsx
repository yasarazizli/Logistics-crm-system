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
import Select, { StylesConfig } from "react-select";

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

export interface TransportationData {
  transportation_type: string;
  full_route_from?: string;
  full_route_to?: string;
  requested_route_from?: string;
  requested_route_to?: string;
  empty_container_return_from?: string;
  empty_container_return_to?: string;
  empty_wagon_return_from?: string;
  empty_wagon_return_to?: string;
  wagon_type?: string;
}

interface Option {
  value: string;
  label: string;
}

interface PackagingFormProps {
  onDataChange: (data: PackagingData) => void;
  onTransportationDataChange?: (data: TransportationData) => void;
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

const PackagingForm: React.FC<PackagingFormProps> = ({ onDataChange }) => {
  // Packaging state
  const [selectedOption1, setSelectedOption1] = useState("Container");
  const [selectedOption2, setSelectedOption2] = useState("20");
  const [selectedOption3, setSelectedOption3] = useState("Standart DC");
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

  // Transportation state
  const [transportationType, setTransportationType] = useState<string>("Rail");
  const [wagonType, setWagonType] = useState<string>("");
  const [wagonProvision, setWagonProvision] = useState<boolean>(false);
  const [wagonProvision2, setWagonProvision2] = useState<boolean>(false);

  // Location data state
  const [countries, setCountries] = useState<Country[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Routes state
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

  // Handle packaging input changes
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

  // Load initial data
  useEffect(() => {
    GetAllCountry().then((res) => setCountries(res?.data?.data || []));
  }, []);

  // Show packing type based on selections
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

    if (selectedOption1 === "Container") {
      packagingData = {
        packing_type: "Container",
        container_type: selectedOption3,
        size: parseInt(selectedOption2) || 0,
        total_quantity: parseInt(containerInputs.totalQuantity) || 0,
        net_weight: parseFloat(containerInputs.netWeight) || 0,
        gross_weight: parseFloat(containerInputs.grossWeight) || 0,
        width: 0,
        height: 0,
        length: 0,
      };
    } else if (selectedOption1 === "Break_Bulk") {
      packagingData = {
        packing_type: "Break_Bulk",
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
        net_weight: parseFloat(bulkLiquidInputs.netWeight) || 0,
        total_quantity: 0,
        gross_weight: 0,
        width: 0,
        height: 0,
        length: 0,
      };
    } else {
      packagingData = {
        packing_type: selectedOption1,
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

  // Transportation handlers
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
      updated[index][type].country = country;
      updated[index][type].city = "";
      updated[index][type].hs = "";
      updated[index][type].port = "";

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
      return [...updated];
    });
  };

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
      cursor: "pointer",
      "&:hover": {
        border: "1px solid #E7E7E7",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "15px 10px",
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
      color: "rgba(0,0,0,0.48)",
    }),
    indicatorSeparator: () => ({ display: "none" }),
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
            <select
              className={styles.select}
              value={selectedOption1}
              onChange={(e) => setSelectedOption1(e.target.value)}
            >
              <option value="Container">Container</option>
              <option value="Break_Bulk">Break_Bulk</option>
              <option value="Bulk">Bulk</option>
              <option value="Oversize_Cargo">Oversize_Cargo</option>
            </select>
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
            <select
              className={styles.select}
              value={selectedOption2}
              onChange={(e) => setSelectedOption2(e.target.value)}
            >
              <option value="20">20</option>
              <option value="40">40</option>
              <option value="45">45</option>
              <option value="other">other</option>
            </select>
          </div>
        )}

        <div className={styles.selectWrapper}>
          <label className={styles.label}>Type</label>
          <select
            className={styles.select}
            value={selectedOption3}
            onChange={(e) => setSelectedOption3(e.target.value)}
          >
            {selectedOption1 === "Break_Bulk" ? (
              <>
                <option value="Bag">Bag</option>
                <option value="Big Bag">Big Bag</option>
                <option value="Box/Crate">Box/Crate</option>
                <option value="Pallet">Pallet</option>
                <option value="Drums/Barrel">Drums/Barrel</option>
                <option value="IBC Tank">IBC Tank</option>
                <option value="Other">Other</option>
              </>
            ) : selectedOption1 === "Bulk" ? (
              <>
                <option value="Bulk Dry">Bulk Dry</option>
                <option value="Bulk Liquid">Bulk Liquid</option>
                <option value="Other">Other</option>
              </>
            ) : (
              <>
                <option value="Standart DC">Standart DC</option>
                <option value="Standart HC">Standart HC</option>
                <option value="Reefer DC">Reefer DC</option>
                <option value="Reefer HC">Reefer HC</option>
                <option value="Open Top">Open Top</option>
                <option value="Flatrack">Flatrack</option>
                <option value="Bulk">Bulk</option>
                <option value="Flexi Tank">Flexi Tank</option>
                <option value="Other">Other</option>
              </>
            )}
          </select>
        </div>
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
            label="Net Weight"
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
            padding: "15px",
            width: "350px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: showPackingTypeInput ? "15px" : "0",
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
            <Input
              type="text"
              placeholder="In Row"
              value={packingType}
              onChange={handlePackingTypeChange}
            />
          )}
        </div>
      )}

      {/* Transportation Type Section */}
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
              <select
                className={styles.select}
                value={transportationType}
                onChange={(e) => setTransportationType(e.target.value)}
              >
                <option value="Rail">Rail</option>
                <option value="Road">Road</option>
                <option value="Sea">Sea</option>
                <option value="Multimodal">Multimodal</option>
              </select>
            </div>
          </div>

          {transportationType !== "Multimodal" && (
            <div className={styles.selected}>
              <label className={styles.label}>Wagon type</label>
              <div className={styles.selectWrapper}>
                <select
                  className={styles.select}
                  value={wagonType}
                  onChange={(e) => setWagonType(e.target.value)}
                >
                  <option value="">Select Wagon Type</option>
                  {wagonOptions[
                    transportationType as "Rail" | "Road" | "Sea"
                  ]?.map((w: string) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Wagon Provision Checkbox */}
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

        {/* Routes Mapping */}
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
                      {/* Country */}
                      <select
                        className={styles.select}
                        value={route.from.country}
                        onChange={(e) =>
                          handleCountryChange(index, "from", e.target.value)
                        }
                      >
                        <option value="">Select Country</option>
                        {countries.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>

                      {/* City */}
                      <select
                        className={styles.select}
                        value={route.from.city}
                        onChange={(e) =>
                          handleFieldChange(
                            index,
                            "from",
                            "city",
                            e.target.value,
                          )
                        }
                        disabled={!route.from.country}
                      >
                        <option value="">Select City</option>
                        {route.fromCities.map((city: City) => (
                          <option key={city.value} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>

                      {/* HS / Port / Address */}
                      {transportationType === "Rail" && (
                        <Select
                          styles={customStyles}
                          placeholder="Select Station Code"
                          value={
                            route.fromStationCodes
                              .map((hs) => ({
                                value: hs.value,
                                label: hs.name,
                              }))
                              .find((opt) => opt.value === route.from.hs) ||
                            null
                          }
                          options={route.fromStationCodes.map((hs) => ({
                            value: hs.value,
                            label: hs.name,
                          }))}
                          onChange={(selected) =>
                            handleFieldChange(
                              index,
                              "from",
                              "hs",
                              selected?.value || "",
                            )
                          }
                        />
                      )}

                      {transportationType === "Sea" && (
                        <select
                          className={styles.select}
                          value={route.from.port}
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              "from",
                              "port",
                              e.target.value,
                            )
                          }
                        >
                          <option value="">Select Port</option>
                          {route.fromPorts.map((p) => (
                            <option key={p.id} value={p.name}>
                              {p.name}
                            </option>
                          ))}
                        </select>
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
                      {/* Country */}
                      <select
                        className={styles.select}
                        value={route.to.country}
                        onChange={(e) =>
                          handleCountryChange(index, "to", e.target.value)
                        }
                      >
                        <option value="">Select Country</option>
                        {countries.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>

                      {/* City */}
                      <select
                        className={styles.select}
                        value={route.to.city}
                        onChange={(e) =>
                          handleFieldChange(index, "to", "city", e.target.value)
                        }
                        disabled={!route.to.country}
                      >
                        <option value="">Select City</option>
                        {route.toCities.map((city: City) => (
                          <option key={city.value} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>

                      {/* HS / Port / Address */}
                      {transportationType === "Rail" && (
                        <Select
                          styles={customStyles}
                          placeholder="Select Station Code"
                          value={
                            route.toStationCodes
                              .map((hs) => ({
                                value: hs.value,
                                label: hs.name,
                              }))
                              .find((opt) => opt.value === route.to.hs) || null
                          }
                          options={route.toStationCodes.map((hs) => ({
                            value: hs.value,
                            label: hs.name,
                          }))}
                          onChange={(selected) =>
                            handleFieldChange(
                              index,
                              "to",
                              "hs",
                              selected?.value || "",
                            )
                          }
                        />
                      )}

                      {transportationType === "Sea" && (
                        <select
                          className={styles.select}
                          value={route.to.port}
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              "to",
                              "port",
                              e.target.value,
                            )
                          }
                        >
                          <option value="">Select Port</option>
                          {route.toPorts.map((p) => (
                            <option key={p.id} value={p.name}>
                              {p.name}
                            </option>
                          ))}
                        </select>
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
