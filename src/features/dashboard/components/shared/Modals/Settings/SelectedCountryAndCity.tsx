import styles from "@/components/Modal/Modal.module.scss";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SelectOption from "@/components/New/SelectOption/SelectOption.tsx";
import { getAllCountriesRequest } from "@/features/dashboard/services/location.service.ts";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { Country } from "@/models/station.model.ts";

const SelectedCountryAndCity = ({
  selected_id,
  modalClose,
}: {
  modalClose: () => void;
  selected_id: (id: number) => void;
}) => {
  const { setLoader } = useContext(LoaderContext);
  const [countries, setCountries] = useState<Country[]>([]);
  const { t } = useTranslation();
  const [id, setId] = useState<number | null>(null);

  const getAllCountries = async () => {
    setLoader(true);
    const { status, data } = await getAllCountriesRequest();
    if (status === 200) setCountries(data);
    setLoader(false);
  };

  // Effects
  useEffect(() => {
    getAllCountries().catch(() => {});
  }, []);
  return (
    <Modal title={t("vendors.modals.create.title")} modalClose={modalClose}>
      <form className={styles.form}>
        <div className={styles.form__inputs}>
          <SelectOption
            label={"Country"}
            options={countries || []}
            onChange={async (selectedOption) => {
              const selectedCountry = countries?.find(
                (country) => country.value === selectedOption.value,
              );

              if (selectedCountry) {
                setId(selectedCountry.value);
              }
            }}
          />

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
            onClick={modalClose}
          />
          <Button
            text={t("shared.buttons.save")}
            type={"button"}
            onClick={() => {
              if (id !== null) {
                selected_id(id);
              }
            }}
          />
        </div>
      </form>
    </Modal>
  );
};

export default SelectedCountryAndCity;
