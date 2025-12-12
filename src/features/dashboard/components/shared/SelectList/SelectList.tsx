import { useEffect, useState } from "react";
import Select, { StylesConfig } from "react-select";
import axios from "axios";
import styles from "./SelectList.module.scss";

const apiUrl = import.meta.env.VITE_API_URL;

interface Option {
  label: string;
  value: number;
}

interface DataItem {
  id: number;
  cargo: string;
  code: string;
}

interface SelectListProps {
  selectedCargo: Option | null;
  setSelectedCargo: (option: Option | null) => void;
  selectedCode: Option | null;
  setSelectedCode: (option: Option | null) => void;
}

const SelectList = ({
  selectedCargo,
  setSelectedCargo,
  selectedCode,
  setSelectedCode,
}: SelectListProps) => {
  const [data, setData] = useState<DataItem[]>([]);
  const [cargoOptions, setCargoOptions] = useState<Option[]>([]);
  const [codeOptions, setCodeOptions] = useState<Option[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/geography/all-hs/`);
        const apiData = response.data.data;
        setData(apiData);

        setCargoOptions(
          apiData.map((item: DataItem) => ({
            label: item.cargo,
            value: item.id,
          })),
        );

        setCodeOptions(
          apiData.map((item: DataItem) => ({
            label: item.code,
            value: item.id,
          })),
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleCargoChange = (option: Option | null) => {
    setSelectedCargo(option);
    if (option) {
      const matched = data.find((d) => d.id === option.value);
      if (matched) setSelectedCode({ label: matched.code, value: matched.id });
    } else {
      setSelectedCode(null);
    }
  };

  const handleCodeChange = (option: Option | null) => {
    setSelectedCode(option);
    if (option) {
      const matched = data.find((d) => d.id === option.value);
      if (matched)
        setSelectedCargo({ label: matched.cargo, value: matched.id });
    } else {
      setSelectedCargo(null);
    }
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
          ? "#beeabe"
          : "white",
      color: state.isSelected ? "white" : "#000",
      ":active": {
        backgroundColor: "#1D736B",
        color: "white",
      },
    }),
  };

  return (
    <div className={styles.all__select}>
      <div className={styles.select}>
        <div className={styles.red}>
          <label>Cargo Name</label>
          <div style={{ color: "red", paddingTop: "6px" }}>*</div>
        </div>
        <Select
          options={cargoOptions}
          value={selectedCargo}
          onChange={handleCargoChange}
          placeholder="Cargo Name"
          styles={customStyles}
          isClearable
        />
      </div>
      <div className={styles.select}>
        <div className={styles.red}>
          <label>Hs Code</label>
          <div style={{ color: "red", paddingTop: "6px" }}>*</div>
        </div>
        <Select
          options={codeOptions}
          value={selectedCode}
          onChange={handleCodeChange}
          placeholder="HS Code"
          styles={customStyles}
          isClearable
        />
      </div>
    </div>
  );
};

export default SelectList;
