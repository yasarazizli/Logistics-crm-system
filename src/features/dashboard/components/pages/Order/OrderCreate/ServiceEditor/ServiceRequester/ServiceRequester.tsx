import { FormEvent, useContext, useEffect, useState } from "react";
import styles from "./ServiceRequester.module.scss";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { toast } from "react-toastify";
import { formCreator } from "@/libs/form.ts";
import SelectOption from "@/components/New/SelectOption/SelectOption.tsx";
import TextArea from "@/components/TextArea/TextArea.tsx";
import Button from "@/components/Button/Button.tsx";
import { postAddMissingServicesRequest } from "@/features/dashboard/services/services.service.ts";
import { errorMessageHandler } from "@/libs/error.ts";
import { useTranslation } from "react-i18next";
import { StoreContext } from "@/contexts/StoreContext.tsx";
import { City, Country } from "@/models/station.model.ts";

const ServiceRequester = () => {
  const { t } = useTranslation();
  const { setLoader } = useContext(LoaderContext);
  const { store, getData } = useContext(StoreContext);

  const [serviceRequest, setServiceRequest] = useState<{
    country: number | null;
    city: number | null;
    description: string;
  }>({
    country: null,
    city: null,
    description: "",
  });

  const [location, setLocation] = useState<{
    countries: Country[];
    cities: {
      [key: string]: City[];
    };
  }>({
    countries: [],
    cities: {},
  });

  const request = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const formData = formCreator([
      { name: "country_id", data: serviceRequest.country },
      { name: "city_id", data: serviceRequest.city },
      { name: "not", data: serviceRequest.description },
    ]);

    const { status, data } = await postAddMissingServicesRequest(formData);

    if (status === 200) {
      toast.success(errorMessageHandler(data));
    } else toast.error(errorMessageHandler(data));

    setLoader(false);
  };

  const getCountries = async () => {
    await getData(["countries"]).then(() => {
      setLocation((prevState) => ({
        ...prevState,
        countries: store.countries || [],
      }));
    });
  };
  const getCities = async (country_id: number) => {
    await getData([`cities-${country_id}`], country_id);
    console.log(store);
  };

  useEffect(() => {
    getCountries().catch(() => {});
  }, []);

  return (
    <div className={styles.service__requester}>
      <p className={styles.title}>{t("order.services.request.title")}</p>

      <form className={styles.form} onSubmit={request}>
        <SelectOption
          required
          label={t("order.services.request.inputs.selected.country")}
          options={location.countries || []}
          onChange={(option) => {
            const selectedCountry = store.countries?.find(
              (cite) => cite.value === option.value,
            );

            setServiceRequest((prevState) => ({
              ...prevState,
              country: Number(selectedCountry?.value),
              city: null,
            }));
            getCities(Number(selectedCountry?.value)).catch(() => {});
          }}
          isSearchable
          isSearch={(searchValue) => {
            setLocation((prevState) => ({
              ...prevState,
              countries:
                store.countries?.filter((option) =>
                  option.name.toLowerCase().includes(searchValue.toLowerCase()),
                ) || [],
            }));
          }}
        />

        <SelectOption
          required
          disabled={!serviceRequest.country}
          label={t("order.services.request.inputs.selected.city")}
          options={store.cities?.[Number(serviceRequest.country)] || []}
          onChange={(option) => {
            const selectedCite = store.cities?.[
              Number(serviceRequest.country)
            ]?.find((cite) => cite.value === option.value);
            setServiceRequest((prevState) => ({
              ...prevState,
              city: Number(selectedCite?.value),
            }));
          }}
          // isSearchable
          // isSearch={(searchValue) => {
          //   setLocation((prevState) => ({
          //     ...prevState,
          //     countries:
          //       store.cities?.[Number(serviceRequest.country)]?.filter(
          //         (option) =>
          //           option.name
          //             .toLowerCase()
          //             .includes(searchValue.toLowerCase()),
          //       ) || [],
          //   }));
          // }}
        />
        <TextArea
          label={t("order.services.request.inputs.textarea")}
          placeholder={t("order.services.request.inputs.textarea")}
          onChange={(event) => {
            setServiceRequest((prevState) => ({
              ...prevState,
              description: event.target.value,
            }));
          }}
        />

        <div className={styles.buttons}>
          <Button text={t("order.services.request.inputs.button")} />
        </div>
      </form>
    </div>
  );
};

export default ServiceRequester;
