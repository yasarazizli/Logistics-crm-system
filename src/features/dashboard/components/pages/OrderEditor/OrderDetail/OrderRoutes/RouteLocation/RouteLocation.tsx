import { memo, useContext, useEffect, useRef, useState } from "react";
import useClickOutside from "@/hooks/useClickOutside.ts";
import styles from "./RouteLocation.module.scss";
import Input from "@/components/Input/Input.tsx";
import SelectOption from "@/components/New/SelectOption/SelectOption.tsx";
import { Country, Station } from "@/models/station.model.ts";
import { StoreContext } from "@/contexts/StoreContext.tsx";

const RouteLocation = ({ label, route, position, setLocation }: any) => {
  const { store, getData } = useContext(StoreContext);

  // Refs
  const boxRef = useRef<HTMLDivElement>(null);
  const clickedInside = useClickOutside(boxRef);

  // States
  const [dropdown, setDropdown] = useState(false);

  // Locations
  const [countries, setCountries] = useState<Country[]>([]);
  const [stations, setStations] = useState<{
    [key: string]: Station[];
  }>();

  // Requests
  const getAllCountries = async () => {
    await getData(["countries"])
      .catch(() => {})
      .then(() => {
        setCountries(store.countries || []);
      });
  };
  const getAllStations = async (country_id: number) => {
    await getData([`stations-${country_id}`], country_id);
  };

  const addressCreator = () => {
    let address = "";

    if (position && route) {
      const country = store.countries?.find(
        (data) => data.value === Number(route[`${position}_country_id`]),
      );

      const station = store.stations?.[route[`${position}_country_id`]]?.find(
        (data) => data.value === Number(route[`${position}_station_id`]),
      );

      if (country) {
        address += `${country.name}`;
      }

      if (station) {
        address += `, ${station.name}`;
      }

      if (route[`${position}_address`]) {
        address += `, ${route[`${position}_address`]}`;
      }
    }

    return address;
  };

  // useEffects
  useEffect(() => {
    getAllCountries().catch(() => {});
  }, []);
  useEffect(() => {
    if (!clickedInside) {
      setDropdown(false);
    }
  }, [clickedInside]);

  return (
    <>
      <div className={styles.route__location}>
        <Input
          label={label}
          placeholder={label}
          value={addressCreator()}
          onClick={() => {
            setDropdown((prevState) => {
              return !prevState;
            });
          }}
        />

        {dropdown && (
          <div className={styles.dropdown} ref={boxRef}>
            {/* Country */}
            <SelectOption
              label={"Country"}
              options={countries || []}
              value={store.countries?.find(
                (country) => country.value === route[`${position}_country_id`],
              )}
              onChange={async (selectedOption) => {
                const selectedCountry = store.countries?.find(
                  (country) => country.value === selectedOption.value,
                );

                if (selectedCountry) {
                  setLocation(selectedCountry.value, `${position}_country_id`);
                  await getAllStations(selectedCountry.value);
                } else setLocation(null, `${position}_country_id`);

                setLocation(null, `${position}_city_id`);
                setLocation("", `${position}_address`);
                setLocation(null, `${position}_station_id`);
              }}
              // Countries Input Search
              isSearchable
              isSearch={(searchValue) => {
                setCountries(
                  store.countries?.filter((option) =>
                    option.name
                      .toLowerCase()
                      .includes(searchValue.toLowerCase()),
                  ) || [],
                );
              }}
            />

            {/* Stations */}
            <SelectOption
              label={"Station Code"}
              options={stations?.[route[`${position}_country_id`]] || []}
              value={store.stations?.[route[`${position}_country_id`]]?.find(
                (city) => city.value === route[`${position}_station_id`],
              )}
              disabled={!route[`${position}_country_id`]}
              onChange={(options) => {
                const selectedStation = store.stations?.[
                  route[`${position}_country_id`]
                ]?.find((cite) => cite.value === options.value);
                if (selectedStation) {
                  setLocation(selectedStation.value, `${position}_station_id`);
                }
              }}
              isSearchable
              isSearch={(searchValue) => {
                setStations({
                  [route[`${position}_country_id`]]:
                    store.stations?.[route[`${position}_country_id`]]?.filter(
                      (option) =>
                        option.name.includes(String(searchValue).toLowerCase()),
                    ) || [],
                });
              }}
            />

            {/* Address */}
            <Input
              label={"Address"}
              placeholder={"Address"}
              // disabled={!route[`${position}_country_id`]}
              defaultValue={`${route[`${position}_address`] || ""}`}
              onChange={(event) => {
                setLocation(event.target.value, `${position}_address`);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default memo(RouteLocation);
