"use client";
import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Select, { SingleValue } from "react-select";

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
  getAllStationCode,
  getAllVendors,
} from "@/features/dashboard/services/Services&Vendor/all.service.ts";

interface OptionType {
  value: number;
  label: string;
}

const CreateServices = ({
  modalClose,
}: {
  modalClose: (isRender: boolean) => void;
}) => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();

  const inputsRef = {
    vendor_id: useRef<HTMLSelectElement>(null),
    service_name: useRef<HTMLInputElement>(null),
    location: useRef<HTMLInputElement>(null),
    hs_code_id: useRef<HTMLSelectElement>(null),
    country_id: useRef<HTMLSelectElement>(null),
    from_id: useRef<HTMLSelectElement>(null),
    to_id: useRef<HTMLSelectElement>(null),
    transport_type: useRef<HTMLSelectElement>(null),
    transport_mode: useRef<HTMLSelectElement>(null),
    contract_experied_date: useRef<HTMLInputElement>(null),
    protocol_experied_date: useRef<HTMLInputElement>(null),
    purchase_price_unit: useRef<HTMLInputElement>(null),
    purchase_price_ton: useRef<HTMLInputElement>(null),
    language: useRef<HTMLSelectElement>(null),
    contract_file: useRef<HTMLInputElement>(null),
    protocol_file: useRef<HTMLInputElement>(null),
  };

  const [vendors, setVendors] = useState<{ id: number; name: string }[]>([]);
  const [hscode, setHsCode] = useState<OptionType[]>([]);
  const [selectedHsCode, setSelectedHsCode] = useState<OptionType | null>(null);
  const [countries, setCountries] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [contractFileName, setContractFileName] = useState<string>("");
  const [protocolFileName, setProtocolFileName] = useState<string>("");

  useEffect(() => {
    setLoader(true);
    const fetchVendors = async () => {
      const { data, status } = await getAllVendors();
      if (status === 200) setVendors(data);
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
      if (status === 200 && Array.isArray(data.data)) setCountries(data.data);
    };

    fetchVendors();
    fetchHsCode();
    fetchCountry();
    setLoader(false);
  }, []);

  const [transportMode, setTransportMode] = useState<string>("Road");
  const [stationCodes, setStationCodes] = useState<any[]>([]);
  const [ports, setPorts] = useState<any[]>([]);

  useEffect(() => {
    if (!selectedCountry) return;
    setLoader(true);

    const countryName = countries.find(
      (c) => c.id === Number(selectedCountry),
    )?.name;
    if (!countryName) return;

    const fetchData = async () => {
      if (transportMode === "Rail") {
        const { data, status } = await getAllStationCode(countryName);
        if (status === 200) setStationCodes(data);
        console.log("data", data);
      } else if (transportMode === "Sea") {
        const { data, status } = await getAllPort(countryName);
        if (status === 200) setPorts(data?.data);
      }
    };
    fetchData();
    setLoader(false);
  }, [transportMode, selectedCountry]);

  const handleFileChange = () => {
    const file = inputsRef.contract_file.current?.files?.[0];
    if (file) setContractFileName(file.name);
  };

  const handleFileChangeProtocol = () => {
    const file = inputsRef.protocol_file.current?.files?.[0];
    if (file) setProtocolFileName(file.name);
  };

  const create = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const formData = formCreator([
      { name: "vendor_id", data: inputsRef.vendor_id.current?.value },
      { name: "service_name", data: inputsRef.service_name.current?.value },
      { name: "location", data: inputsRef.location.current?.value },
      { name: "hs_code_id", data: selectedHsCode?.value || null },
      { name: "country_id", data: inputsRef.country_id.current?.value },
      { name: "from_id", data: inputsRef.from_id.current?.value },
      { name: "to_id", data: inputsRef.to_id.current?.value },
      { name: "transport_type", data: inputsRef.transport_type.current?.value },
      { name: "transport_mode", data: inputsRef.transport_mode.current?.value },
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
        name: "language",
        data: inputsRef.language.current?.value,
      },
      {
        name: "contract_file",
        data: inputsRef.contract_file.current?.files?.[0],
      },
      {
        name: "protocol_file",
        data: inputsRef.protocol_file.current?.files?.[0],
      },
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
                {/* Vendor Select */}
                <div className={styles.selectWrapper}>
                  <label className={styles.label}>
                    {t("services.modals.create.vendor_select")}
                  </label>
                  <select
                    className={styles.select}
                    required
                    ref={inputsRef.vendor_id}
                  >
                    <option value="">
                      {t("services.modals.create.value")}
                    </option>
                    {vendors.map((vendor) => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Service Name */}
                <Input
                  type="text"
                  label={t("services.modals.create.service_name")}
                  placeholder={t("services.modals.create.service_name")}
                  inputRef={inputsRef.service_name}
                  autoComplete="off"
                  required
                />
              </div>

              <div className={styles.flex__row}>
                {/* Location */}
                <Input
                  type="text"
                  label={t("services.modals.create.location")}
                  placeholder={t("services.modals.create.location")}
                  inputRef={inputsRef.location}
                  autoComplete="off"
                  required
                />

                {/* HS Code */}
                <div className={styles.selectWrapper}>
                  <label className={styles.label}>
                    {t("services.modals.create.hs_code")}
                  </label>
                  <Select
                    options={hscode}
                    value={selectedHsCode}
                    onChange={(val: SingleValue<OptionType>) =>
                      setSelectedHsCode(val)
                    }
                    isSearchable
                    placeholder={t(
                      "services.modals.create.hs_code_placeholder",
                    )}
                    styles={{
                      control: (base) => ({
                        ...base,
                        height: "52px",
                        minHeight: "52px",
                        backgroundColor: "#F5F5F5",
                        borderColor: "#ccc",
                        boxShadow: "none",
                      }),
                    }}
                  />
                </div>
                {/* Country */}
                <div className={styles.selectWrapper}>
                  <label className={styles.label}>
                    {t("services.modals.create.select_country")}
                  </label>
                  <select
                    className={styles.select}
                    required
                    ref={inputsRef.country_id}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                  >
                    <option value="">
                      {t("services.modals.create.value")}
                    </option>
                    {countries.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Transport Mode */}
              <div className={styles.selectWrapper}>
                <label className={styles.label}>
                  {t("services.modals.create.transport__mode")}
                </label>
                <select
                  className={styles.select}
                  required
                  ref={inputsRef.transport_mode}
                  onChange={(e) => setTransportMode(e.target.value)}
                >
                  <option value="">{t("services.modals.create.value")}</option>
                  <option value="Road">Road</option>
                  <option value="Rail">Rail</option>
                  <option value="Sea">Sea</option>
                </select>
              </div>

              <div className={styles.flex__mode}>
                {transportMode === "Road" ? (
                  <>
                    <div className={styles.selectWrapper}>
                      <label className={styles.label}>From</label>
                      <Input
                        type="text"
                        inputRef={inputsRef.from_id}
                        placeholder="From location"
                      />
                    </div>
                    <div className={styles.selectWrapper}>
                      <label className={styles.label}>To</label>
                      <Input
                        type="text"
                        inputRef={inputsRef.to_id}
                        placeholder="To location"
                      />
                    </div>
                  </>
                ) : transportMode === "Rail" ? (
                  <>
                    <div className={styles.selectWrapper}>
                      <label className={styles.label}>From Station</label>
                      <select ref={inputsRef.from_id} className={styles.select}>
                        <option value="">Select From Station</option>
                        {stationCodes.map((st) => (
                          <option key={st.value} value={st.value}>
                            {st.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.selectWrapper}>
                      <label className={styles.label}>To Station</label>
                      <select ref={inputsRef.to_id} className={styles.select}>
                        <option value="">Select To Station</option>
                        {stationCodes.map((st) => (
                          <option key={st.value} value={st.value}>
                            {st.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : transportMode === "Sea" ? (
                  <>
                    <div className={styles.selectWrapper}>
                      <label className={styles.label}>From Port</label>
                      <select ref={inputsRef.from_id} className={styles.select}>
                        <option value="">Select From Port</option>
                        {ports.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.selectWrapper}>
                      <label className={styles.label}>To Port</label>
                      <select ref={inputsRef.to_id} className={styles.select}>
                        <option value="">Select To Port</option>
                        {ports.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : null}
              </div>

              <div className={styles.flex__row}>
                {/* Transport Type */}
                <div className={styles.selectWrapper}>
                  <label className={styles.label}>
                    {t("services.modals.create.transport__type")}
                  </label>
                  <select
                    className={styles.select}
                    required
                    ref={inputsRef.transport_type}
                  >
                    <option value="">
                      {t("services.modals.create.value")}
                    </option>
                    <option value="Container">Container</option>
                    <option value="Break Bulk">Break Bulk</option>
                    <option value="Bulk">Bulk</option>
                    <option value="Oversize cargo">Oversize cargo</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.flex__mode}>
                {/* Contract End Start */}
                <Input
                  type="date"
                  label={t("services.modals.create.contract__date")}
                  inputRef={inputsRef.contract_experied_date}
                  autoComplete="off"
                  required
                />

                {/* Contract End Date */}
                <Input
                  type="date"
                  label={t("services.modals.create.protocol__date")}
                  inputRef={inputsRef.protocol_experied_date}
                  autoComplete="off"
                  required
                />
              </div>

              <div className={styles.flex__mode}>
                {/* Service Name */}
                <Input
                  type="text"
                  label={t("services.modals.create.per__unit")}
                  placeholder={t("services.modals.create.value")}
                  inputRef={inputsRef.purchase_price_unit}
                  autoComplete="off"
                  required
                />
                {/* Service Name */}
                <Input
                  type="text"
                  label={t("services.modals.create.per__ton")}
                  placeholder={t("services.modals.create.value")}
                  inputRef={inputsRef.purchase_price_ton}
                  autoComplete="off"
                  required
                />
              </div>

              <div className={styles.flex__row}>
                {/* Contract Language */}
                <div className={styles.selectWrapper}>
                  <label className={styles.label}>
                    {t("services.modals.create.contract_language")}
                  </label>
                  <select
                    className={styles.select}
                    required
                    ref={inputsRef.language}
                  >
                    <option value="">
                      {t("services.modals.create.value")}
                    </option>
                    <option value="Azerbaijani">Azerbaijani</option>
                    <option value="Russian">Russian</option>
                    <option value="English">English</option>
                  </select>
                </div>
              </div>

              {/* Contract File */}
              <div className={styles.dropzone}>
                <div
                  style={{
                    marginTop: "28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <span>{t("services.modals.create.contract__file")}</span>
                  <label
                    htmlFor="contract-file-upload"
                    className={styles.dropzone__label}
                  >
                    {contractFileName ||
                      t("services.modals.create.file__placeholder")}
                  </label>
                  <input
                    type="file"
                    id="contract-file-upload"
                    ref={inputsRef.contract_file}
                    onChange={handleFileChange}
                    className={styles.dropzone__input}
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  />
                </div>
              </div>
              {/* Protocol File */}
              <div className={styles.dropzone}>
                <div
                  style={{
                    marginTop: "28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <span>{t("services.modals.create.upload__file")}</span>
                  <label
                    htmlFor="protocol-file-upload"
                    className={styles.dropzone__label}
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
            </div>
          </div>
        </div>

        {/* Buttons */}
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
