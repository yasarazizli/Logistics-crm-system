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
  createServices,
  getAllCountry,
  getAllPort,
  getAllServicesName,
  getAllStationCode,
  getAllVendors,
} from "@/features/dashboard/services/Services&Vendor/all.service.ts";

interface OptionType {
  value: number;
  label: string;
}

const customStyles: StylesConfig<OptionType, false> = {
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

const CreateServices = ({
  modalClose,
}: {
  modalClose: (isRender: boolean) => void;
}) => {
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

  const [vendors, setVendors] = useState<OptionType[]>([]);
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
    { value: 1, label: "Container" },
    { value: 2, label: "Break Bulk" },
    { value: 3, label: "Bulk" },
    { value: 4, label: "Oversize cargo" },
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

  useEffect(() => {
    setLoader(true);

    const fetchVendors = async () => {
      const { data, status } = await getAllVendors();
      if (status === 200) {
        const mapped = data.map((vendor: { id: number; name: string }) => ({
          value: vendor.id,
          label: vendor.name,
        }));
        setVendors(mapped);
      }
    };

    const fetchHsCode = async () => {
      const { data, status } = await allHsCode();
      if (status === 200 && Array.isArray(data.data)) {
        const mapped = data.data.map(
          (item: { id: number; cargo: string; description: string }) => ({
            value: item.id,
            label: `${item.cargo} - ${item.description}`,
          }),
        );
        setHsCode(mapped);
      }
    };

    const fetchCountry = async () => {
      const { data, status } = await getAllCountry();
      if (status === 200 && Array.isArray(data.data)) {
        const mapped = data.data.map(
          (country: { id: number; name: string }) => ({
            value: country.id,
            label: country.name,
          }),
        );
        setCountries(mapped);
      }
    };

    const fetchServiceNames = async () => {
      try {
        const response = await getAllServicesName();

        if (response.status === 200) {
          const serviceData = response.data.data || response.data;

          if (Array.isArray(serviceData)) {
            const mapped = serviceData.map(
              (service: { ID: number; name: string }) => ({
                value: service.ID,
                label: service.name,
              }),
            );
            setServiceNames(mapped);
          }
        }
      } catch (error) {
        console.error("Error fetching service names:", error);
      }
    };

    Promise.all([
      fetchVendors(),
      fetchHsCode(),
      fetchCountry(),
      fetchServiceNames(),
    ]).finally(() => {
      setLoader(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedCountry || !selectedTransportMode) return;

    if (selectedTransportMode.label === "Multimodal") {
      setStationCodes([]);
      setPorts([]);
      return;
    }

    setLoader(true);

    const countryName = selectedCountry.label;
    const transportMode = selectedTransportMode.label;

    const fetchData = async () => {
      if (transportMode === "Rail") {
        const { data, status } = await getAllStationCode(countryName);
        if (status === 200) {
          const mapped = data.map(
            (station: { value: number; name: string }) => ({
              value: station.value,
              label: station.name,
            }),
          );
          setStationCodes(mapped);
        }
      } else if (transportMode === "Sea") {
        const { data, status } = await getAllPort(countryName);
        if (status === 200) {
          const mapped =
            data?.data?.map((port: { id: number; name: string }) => ({
              value: port.id,
              label: port.name,
            })) || [];
          setPorts(mapped);
        }
      }
    };

    fetchData().finally(() => {
      setLoader(false);
    });
  }, [selectedCountry, selectedTransportMode]);

  const handleFileChangeProtocol = () => {
    const file = inputsRef.protocol_file.current?.files?.[0];
    if (file) setProtocolFileName(file.name);
  };

  const create = async (event: FormEvent) => {
    event.preventDefault();
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
      { name: "transport_type", data: selectedTransportType?.label || null },
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
    ]);

    const { status, data } = await createServices(formData);
    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));

    setLoader(false);
    modalClose(true);
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
                    options={vendors}
                    value={selectedVendor}
                    onChange={setSelectedVendor}
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
                <Input
                  type="text"
                  label={t("services.modals.create.location")}
                  placeholder={t("services.modals.create.location")}
                  inputRef={inputsRef.location}
                  autoComplete="off"
                  required
                  maxLength={11}
                />
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
                {selectedTransportMode?.label === "Road" ||
                selectedTransportMode?.label === "Multimodal" ? (
                  <>
                    <div className={styles.selectWrapper}>
                      <Input
                        type="text"
                        label={
                          selectedTransportMode?.label === "Multimodal"
                            ? "From Address"
                            : "From"
                        }
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
                      />
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            <div className={styles.right}>
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
                <Input
                  type="date"
                  label={t("services.modals.create.contract__date")}
                  inputRef={inputsRef.contract_experied_date}
                  autoComplete="off"
                  required
                />

                <Input
                  type="date"
                  label={t("services.modals.create.protocol__date")}
                  inputRef={inputsRef.protocol_experied_date}
                  autoComplete="off"
                  required
                />
              </div>

              <div className={styles.flex__mode}>
                <Input
                  type="text"
                  label={t("services.modals.create.per__unit")}
                  placeholder={t("services.modals.create.value")}
                  inputRef={inputsRef.purchase_price_unit}
                  autoComplete="off"
                  required
                />

                <Input
                  type="text"
                  label={t("services.modals.create.per__ton")}
                  placeholder={t("services.modals.create.value")}
                  inputRef={inputsRef.purchase_price_ton}
                  autoComplete="off"
                  required
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
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  />
                </div>
              </div>
              <Input
                type="text"
                label={"Note"}
                placeholder={"Note"}
                inputRef={inputsRef.note}
                autoComplete="off"
                required
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

export default CreateServices;
