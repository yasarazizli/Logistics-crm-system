import { FormEvent, useContext, useEffect, useRef, useState } from "react";

import { DataContext } from "@/contexts/DataContext.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";

import styles from "@/components/Modal/Modal.module.scss";

import Tabs from "@/components/Tabs/Tabs.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import Input from "@/components/Input/Input.tsx";
import Button from "@/components/Button/Button.tsx";
import SelectOption from "@/components/New/SelectOption/SelectOption.tsx";
import FileInput from "@/components/FileInput/FileInput.tsx";

import { formCreator } from "@/libs/form.ts";
import { toast } from "react-toastify";
import { dateToInputFormat } from "@/libs/date.ts";
import { postServiceCreateRequest } from "@/features/dashboard/services/services.service.ts";

const ServiceCreated = ({ modalClose }: { modalClose: () => void }) => {
  const { store, getData, resetData } = useContext(DataContext);
  const { setLoader } = useContext(LoaderContext);
  const [isRouteService, setIsRouteService] = useState<boolean>(false);
  const [serviceRoute, setServiceRoute] = useState<{
    city: number | null;
    country: number | null;
    vendor_id: number | null;
  }>({
    city: null,
    country: null,
    vendor_id: null,
  });

  const [contract, setContract] = useState({
    contract_start_date: "",
    contract_end_date: "",
  });

  const inputsRef = {
    name: useRef<HTMLInputElement>(null),
    raw_cost: useRef<HTMLInputElement>(null),
    selling_price: useRef<HTMLInputElement>(null),
    file: useRef<HTMLInputElement>(null),
    language: useRef<HTMLInputElement>(null),
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const formData = formCreator([
      {
        name: "name",
        data: inputsRef.name.current?.value,
      },
      {
        name: "raw_cost",
        data: inputsRef.raw_cost.current?.value,
      },
      {
        name: "route_service_country_id",
        data: serviceRoute.country,
      },
      {
        name: "city_id",
        data: serviceRoute.city,
      },
      {
        name: "vendor_id",
        data: serviceRoute.vendor_id,
      },
      {
        name: "selling_price",
        data: inputsRef.selling_price.current?.value,
      },
      {
        name: "file",
        data: inputsRef.file.current?.files?.[0],
      },
      {
        name: "contract_start_date",
        data: contract.contract_start_date,
      },
      {
        name: "contract_end_date",
        data: contract.contract_end_date,
      },
      {
        name: "contract_language",
        data: inputsRef.language.current?.value,
      },
    ]);
    const { status } = await postServiceCreateRequest(formData);
    if (status === 200) {
      toast.success("Contract verified successfully.");
    }
    setLoader(false);
    modalClose();
  };

  useEffect(() => {
    getData(["countries", "vendors"]).catch(() => {});
  }, []);

  return (
    <Modal title={"Service Elave Edin"} modalClose={modalClose}>
      <form className={styles.form} onSubmit={submit}>
        <div className={styles.form__inputs}>
          <div className={styles.grid}>
            <Input
              label={"Servicenin Adi"}
              inputRef={inputsRef.name}
              required
            />
            <Input
              label={"Row Cast"}
              type={"number"}
              inputRef={inputsRef.raw_cost}
              required
            />
          </div>

          <Tabs
            active={isRouteService ? 1 : 0}
            tabs={[
              {
                name: "None Route Country",
                tab: 0,
                onClick: () => setIsRouteService(false),
              },
              {
                name: "Route Country",
                tab: 1,
                onClick: () => setIsRouteService(true),
              },
            ]}
          />

          {isRouteService && (
            <div className={styles.grid}>
              <SelectOption
                label={"Select Country"}
                required
                options={store?.countries || []}
                onChange={async (option) => {
                  const selectedCountry = store?.countries?.find(
                    (country) => country.value === option.value,
                  );

                  if (selectedCountry) {
                    await resetData("cities", Number(selectedCountry.value));
                    setServiceRoute((prevState) => ({
                      ...prevState,
                      country: selectedCountry.value,
                    }));
                  }
                }}
              />
              <SelectOption
                label={"Select Cite"}
                required
                disabled={!serviceRoute.country}
                options={store?.cities || []}
                onChange={(option) => {
                  const selectedCite = store.cities?.find(
                    (cite) => cite.value === option.value,
                  );
                  if (selectedCite) {
                    setServiceRoute((prevState) => ({
                      ...prevState,
                      city: selectedCite.value,
                    }));
                  }
                }}
              />
            </div>
          )}

          <SelectOption
            label={"Select vendor"}
            required
            options={store.vendors || []}
            onChange={(option) => {
              const selectedVendor = store?.vendors?.find(
                (vendor) => vendor.value === option.value,
              );
              if (selectedVendor) {
                setServiceRoute((prevState) => ({
                  ...prevState,
                  vendor_id: selectedVendor.value,
                }));
              }
            }}
          />

          <div className={styles.grid}>
            <Input
              label={"Contractin Bashlama Tarixi"}
              type={"date"}
              onChange={(event) => {
                setContract((prevState) => ({
                  ...prevState,
                  contract_start_date: new Date(
                    event.target.value,
                  ).toISOString(),
                }));
              }}
              required
            />
            <Input
              label={"Contractin Bitme Tarixi"}
              type={"date"}
              min={dateToInputFormat(contract.contract_start_date)}
              onChange={(event) => {
                setContract((prevState) => ({
                  ...prevState,
                  contract_end_date: new Date(event.target.value).toISOString(),
                }));
              }}
              required
            />
          </div>
          <SelectOption
            inputRef={inputsRef.language}
            label={"Select contract language"}
            required
            options={[
              { name: "AZE", value: "aze" },
              { name: "ENG", value: "eng" },
              { name: "RUS", value: "rus" },
            ]}
          />

          <FileInput inputRef={inputsRef.file} />
        </div>

        <div className={styles.form__buttons}>
          <Button
            text={"Ləğv et"}
            viewType={"dark-green"}
            type={"button"}
            onClick={() => {
              modalClose();
            }}
          />
          <Button text={"Yadda saxla"} type={"submit"} />
        </div>
      </form>
    </Modal>
  );
};

export default ServiceCreated;
