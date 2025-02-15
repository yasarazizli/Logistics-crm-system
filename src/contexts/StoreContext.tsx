import { createContext, PropsWithChildren, useRef, useState } from "react";
import { City, Country, HsCodeModel, Station } from "@/models/station.model.ts";
import {
  getAllCitiesRequest,
  getAllCountriesRequest,
  getAllHsCodeRequest,
} from "@/features/dashboard/services/location.service.ts";
import { VendorModel } from "@/features/dashboard/models/vendor.model.ts";
import { ServiceModel } from "@/features/dashboard/models/service.model.ts";
import { getAllVendorsRequest } from "@/features/dashboard/services/vendors.service.ts";
import { getAllServicesRequest } from "@/features/dashboard/services/services.service.ts";

export const StoreContext = createContext<{
  store: {
    countries?: Country[];
    cities?: {
      [key: string]: City[];
    };
    stations?: {
      [key: string]: Station[];
    };
    hsCode?: HsCodeModel[];
    vendors?: VendorModel[];
    services?: ServiceModel[];
  };

  getData(names: string[], id?: number): Promise<void>;
}>({
  store: {},
  getData: async () => {},
});

export const StoreProvider = ({ children }: PropsWithChildren) => {
  const [store, setStore] = useState<{
    countries?: Country[];
    cities?: {
      [key: string]: City[];
    };
    stations?: {
      [key: string]: Station[];
    };
    hsCode?: HsCodeModel[];
    vendors?: VendorModel[];
    services?: ServiceModel[];
  }>({});
  const fetchingRef = useRef<string[]>([]);

  const getStoreData = async (name: string, id?: number) => {
    if (name === "countries") {
      const { status, data } = await getAllCountriesRequest();
      if (status === 200) return data;
    }

    if (name === "cities" && id !== undefined) {
      const { status, data } = await getAllCitiesRequest(id);
      if (status === 200) {
        return data;
      }
    }

    if (name === "hsCode") {
      const { status, data } = await getAllHsCodeRequest();
      if (status === 200) return data;
    }

    if (name === "vendors") {
      const { status, data } = await getAllVendorsRequest(
        "",
        "",
        "",
        "verified",
      );
      if (status === 200) return data;
    }

    if (name === "services") {
      const { status, data } = await getAllServicesRequest(
        "",
        "",
        "",
        "verified",
      );
      if (status === 200) return data;
    }
  };

  const getData = async (names: string[], id?: number) => {
    const newValues: Record<string, any> = {};

    const namesToFetch = names.filter((name) => {
      if (name === `cities-${id}` && id !== undefined) {
        return !store.cities?.[id] && !fetchingRef.current.includes(name);
      }
      if (name === `stations-${id}` && id !== undefined) {
        return !store.stations?.[id];
      }
      // Diğer veriler için genel kontrol
      return (
        !store[name as keyof typeof store] &&
        !fetchingRef.current.includes(name)
      );
    });

    // console.log(namesToFetch);

    // İşaretleme: fetchingRef'i güncelle
    fetchingRef.current.push(...namesToFetch);

    const fetchPromises = namesToFetch.map((n) => {
      const name = n.split("-")[0];
      return getStoreData(name, id).then((data) => {
        if (name === "cities" && id !== undefined) {
          // Cities için belirli bir id'yi ekle
          newValues.cities = {
            ...store.cities, // Mevcut cities verisini koru
            [id]: data, // Yeni id'yi ekle
          };
        } else if (name === "stations" && id !== undefined) {
          // Stations için belirli bir id'yi ekle
          newValues.stations = {
            ...store.stations, // Mevcut stations verisini koru
            [id]: data, // Yeni id'yi ekle
          };
        } else {
          // Diğer veriler için doğrudan ekle
          newValues[name] = data;
        }
      });
    });

    await Promise.all(fetchPromises);

    // fetchingRef temizleme
    fetchingRef.current = fetchingRef.current.filter(
      (name) => !namesToFetch.includes(name),
    );

    setStore((prevState) => {
      const keys = Object.keys(newValues);
      const oldPrevState: any = { ...prevState };

      keys.map((key) => {
        if (Array.isArray(newValues[key])) {
          oldPrevState[key] = newValues[key];
        } else {
          if (oldPrevState[key]) {
            oldPrevState[key] = { ...oldPrevState[key], ...newValues[key] };
          } else {
            oldPrevState[key] = newValues[key];
          }
        }
      });

      return { ...oldPrevState };
    });
  };

  return (
    <StoreContext.Provider value={{ store, getData }}>
      {children}
    </StoreContext.Provider>
  );
};
