import styles from "@/components/Modal/Modal.module.scss";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import { FormEvent, useContext, useEffect, useRef } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { formCreator } from "@/libs/form.ts";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { postVendorCreateRequest } from "@/features/dashboard/services/vendors.service.ts";
import { StoreContext } from "@/contexts/StoreContext.tsx";
import SelectOption from "@/components/New/SelectOption/SelectOption.tsx";
import Input from "@/components/Input/Input.tsx";
import { errorMessageHandler } from "@/libs/error.ts";

const LocationCreate = ({
  modalClose,
  type,
}: {
  modalClose: (isRender: boolean) => void;
  type: string;
}) => {
  const { setLoader } = useContext(LoaderContext);
  const { store, getData } = useContext(StoreContext);
  const { t } = useTranslation();

  const inputsRef = {
    country_name: useRef<HTMLInputElement>(null),
    city_name: useRef<HTMLInputElement>(null),
    station_name: useRef<HTMLInputElement>(null),
    city_id: useRef<HTMLInputElement>(null),
    country_id: useRef<HTMLInputElement>(null),
  };

  const create = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const formData = formCreator([
      ...(type === "country"
        ? [
            {
              name: "name",
              data: inputsRef.country_name.current?.value,
            },
          ]
        : []),

      ...(type === "city"
        ? [
            {
              name: "name",
              data: inputsRef.city_name.current?.value,
            },
            {
              name: "country_id",
              data: inputsRef.country_id.current?.value,
            },
          ]
        : []),

      ...(type === "station"
        ? [
            {
              name: "name",
              data: inputsRef.station_name.current?.value,
            },
            {
              name: "city_id",
              data: inputsRef.city_id.current?.value,
            },
          ]
        : []),
    ]);

    const { status, data } = await postVendorCreateRequest(formData);

    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));

    setLoader(false);
    modalClose(true);
  };

  useEffect(() => {
    getData(["countries"]).catch(() => {});
  }, []);

  return (
    <Modal
      title={t("vendors.modals.create.title")}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={create}>
        <div className={styles.form__inputs}>
          {type === "country" && (
            <Input
              label={"Country Name"}
              placeholder={"Country Name"}
              inputRef={inputsRef.country_name}
            />
          )}

          {type === "city" && (
            <>
              <SelectOption
                label={"Country"}
                options={store.countries || []}
                inputRef={inputsRef.country_id}
                onChange={async (selectedOption) => {
                  const selectedCountry = store.countries?.find(
                    (country) => country.value === selectedOption.value,
                  );

                  if (selectedCountry) {
                    await getData(["cities"], selectedCountry.value);
                  }
                }}
              />

              <Input
                label={"Country Name"}
                placeholder={"Country Name"}
                inputRef={inputsRef.country_name}
              />
            </>
          )}

          {/*<SelectOption*/}
          {/*    label={"City"}*/}
          {/*    disabled={!location.country}*/}
          {/*    options={store.cities?.[location.country as number] || []}*/}
          {/*    onChange={async (options) => {*/}
          {/*        const selectedCite = store.cities?.[*/}
          {/*            location.country as number*/}
          {/*            ]?.find((city) => city.value === options.value);*/}

          {/*        if (selectedCite) {*/}
          {/*            setLocation((prevState)=>({*/}
          {/*                ...prevState,*/}
          {/*                country: Number(selectedCite.value),*/}
          {/*            }))*/}
          {/*            await getData(["stations"], selectedCite.value);*/}
          {/*        }*/}
          {/*    }}*/}
          {/*/>*/}

          {/*<SelectOption*/}
          {/*    label={"Station Code"}*/}
          {/*    options={store.stations?.[route[`${position}_city_id`]] || []}*/}
          {/*    value={store.stations?.[route[`${position}_city_id`]]?.find(*/}
          {/*        (city) => city.value === route[`${position}_station_id`],*/}
          {/*    )}*/}
          {/*    disabled={route[`${position}_city_id`] === null}*/}
          {/*    onChange={(options) => {*/}
          {/*        const selectedCite = store.stations?.[*/}
          {/*            route[`${position}_city_id`]*/}
          {/*            ]?.find((cite) => cite.value === options.value);*/}
          {/*        if (selectedCite) {*/}
          {/*            setLocation(selectedCite.value, `${position}_station_id`);*/}
          {/*        }*/}
          {/*    }}*/}
          {/*/>*/}
        </div>

        <div className={styles.form__buttons}>
          <Button
            text={t("shared.buttons.cancel")}
            viewType={"dark-green"}
            type={"button"}
            onClick={() => modalClose(false)}
          />
          <Button text={t("shared.buttons.save")} type={"submit"} />
        </div>
      </form>
    </Modal>
  );
};

export default LocationCreate;
