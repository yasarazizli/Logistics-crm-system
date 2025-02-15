import { memo, useContext, useEffect, useRef, useState } from "react";
import useClickOutside from "@/hooks/useClickOutside.ts";
import styles from "./RouteLocation.module.scss";
import Input from "@/components/Input/Input.tsx";
import SelectOption from "@/components/New/SelectOption/SelectOption.tsx";
import { City, Country } from "@/models/station.model.ts";
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
  const [cities, setCities] = useState<{
    [key: string]: City[];
  }>();

  // Requests
  const getAllCountries = async () => {
    await getData(["countries"])
      .catch(() => {})
      .then(() => {
        setCountries(store.countries || []);
      });
  };
  const getAllCities = async (country_id: number) => {
    await getData([`cities-${country_id}`], country_id);
  };

  const addressCreator = () => {
    let address = "";

    if (position && route) {
      const country = store.countries?.find(
        (i) => i.value === Number(route[`${position}_country_id`]),
      );

      const city = store.cities?.[route[`${position}_country_id`]]?.find(
        (city) => city.value === Number(route[`${position}_city_id`]),
      );

      if (country) {
        address += `${country.name}`;
      }

      if (city) {
        address += `, ${
          store.cities?.[route[`${position}_country_id`]]?.find(
            (city) => city.value === Number(route[`${position}_city_id`]),
          )?.name
        }`;
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
    if (route.start_country_id) {
      getAllCities(route.start_country_id).catch(() => {});
    }

    if (route.end_country_id) {
      getAllCities(route.end_country_id).catch(() => {});
    }
  }, [route.start_country_id, route.end_country_id]);

  useEffect(() => {
    setCities(store.cities);
  }, [store.cities]);

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
          style={{
            outline: "none",
            cursor: "pointer",
          }}
          onChange={(event) => {
            setLocation(event.target.value, `${position}_address`);
          }}
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
                  await getAllCities(selectedCountry.value);
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

            {/* City */}
            <SelectOption
              label={"City"}
              disabled={!route[`${position}_country_id`]}
              options={cities?.[route[`${position}_country_id`]] || []}
              value={store.cities?.[route[`${position}_country_id`]]?.find(
                (city) => city.value === Number(route[`${position}_city_id`]),
              )}
              onChange={async (options) => {
                const selectedCite = store.cities?.[
                  route[`${position}_country_id`]
                ]?.find((city) => city.value === options.value);

                if (selectedCite) {
                  await getData(["stations"], selectedCite.value);
                  setLocation(selectedCite.value, `${position}_city_id`);
                  setLocation(null, `${position}_station_id`);
                }
              }}
              // Cities Input Search
              isSearchable
              isSearch={(searchValue) => {
                setCities({
                  [route[`${position}_country_id`]]:
                    store.cities?.[route[`${position}_country_id`]]?.filter(
                      (option) =>
                        option.name
                          .toLowerCase()
                          .includes(searchValue.toLowerCase()),
                    ) || [],
                });
              }}
            />

            {/* Address */}
            <Input
              label={"Address"}
              placeholder={"Address"}
              disabled={!route[`${position}_city_id`]}
              value={`${route[`${position}_address`] || ""}`}
              onChange={(event) => {
                setLocation(event.target.value, `${position}_address`);
              }}
            />

            {/* Stations */}
            <SelectOption
              label={"Station Code"}
              options={store.stations?.[route[`${position}_city_id`]] || []}
              value={store.stations?.[route[`${position}_city_id`]]?.find(
                (city) => city.value === route[`${position}_station_id`],
              )}
              disabled={route[`${position}_city_id`] === null}
              onChange={(options) => {
                const selectedCite = store.stations?.[
                  route[`${position}_city_id`]
                ]?.find((cite) => cite.value === options.value);
                if (selectedCite) {
                  setLocation(selectedCite.value, `${position}_station_id`);
                }
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default memo(RouteLocation);
