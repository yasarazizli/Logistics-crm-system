import React, {
  createContext,
  PropsWithChildren,
  useRef,
  useState,
} from "react";
import {
  getAllCountriesRequest,
  getAllCitiesRequest,
  getAllStationsRequest,
  getAllHsCodeRequest,
} from "@/features/dashboard/services/location.service.ts";
import { City, Country, HsCodeModel, Station } from "@/models/station.model.ts";
import { VendorModel } from "@/features/dashboard/models/vendor.model.ts";
import { getAllVendorsRequest } from "@/features/dashboard/services/vendors.service.ts";
import { getAllServicesRequest } from "@/features/dashboard/services/services.service.ts";
import { ServiceModel } from "@/features/dashboard/models/service.model.ts";

export const DataContext = createContext<{
  store: {
    countries?: Country[];
    cities?: City[];
    stations?: Station[];
    hsCode?: HsCodeModel[];
    vendors?: VendorModel[];
    services?: ServiceModel[];
    // allStation?: Station[];
  };

  setStore: React.Dispatch<
    React.SetStateAction<{
      countries?: Country[];
      cities?: City[];
      stations?: Station[];
    }>
  >;

  getData(names: string[], id?: number): Promise<void>;
  resetData(name: string, id?: number): Promise<void>;
}>({
  store: {},
  setStore: () => {},

  getData: async () => {},
  resetData: async () => {},
});

export const DataProvider = ({ children }: PropsWithChildren) => {
  const fetchingRef = useRef<string[]>([]);
  const [store, setStore] = useState<{
    countries?: Country[];
    cities?: City[];
    stations?: Station[];
    hsCode?: HsCodeModel[];

    [key: string]: Country[] | City[] | Station[] | HsCodeModel[] | undefined;

    // allStation?: Station[];
    // vendors?: VendorModel[];
    // services?: ServiceModel[];
  }>({});

  const getStoreData = async (name: string, id?: number) => {
    if (name === "countries") {
      const { status, data } = await getAllCountriesRequest();
      if (status === 200) return data;
    }

    if (name === "cities") {
      const { status, data } = await getAllCitiesRequest(id);
      if (status === 200) return data;
    }

    if (name === "stations") {
      const { status, data } = await getAllStationsRequest(id);
      if (status === 200) return data;
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

  const resetData = async (name: string, id: number) => {
    setStore((prevState) => {
      const { [name]: _, ...rest } = prevState;
      return rest;
    });

    await getData([name], id);
  };

  const getData = async (names: string[], id: number) => {
    const newValues: Record<string, any> = {};

    // Filtreleme: Sadece gerekli öğelerle işlem yapılır
    const namesToFetch = names.filter(
      (name) =>
        !store[name as keyof typeof store] &&
        !fetchingRef.current.includes(name),
    );

    // İşaretleme: fetchingRef'i güncelle
    fetchingRef.current.push(...namesToFetch);

    // Verileri paralel olarak çek
    const fetchPromises = namesToFetch.map((name) =>
      getStoreData(name, id).then((data) => {
        console.log(name);
        newValues[name] = data;
      }),
    );

    await Promise.all(fetchPromises);

    // fetchingRef temizleme
    fetchingRef.current = fetchingRef.current.filter(
      (name) => !namesToFetch.includes(name),
    );

    // Store'u güncelle
    setStore((prevState) => ({ ...prevState, ...newValues }));
  };

  const data = {
    store,
    setStore,
    getData,
    resetData,
  };

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

// // Yeni versiya
// import React, {
//   createContext,
//   PropsWithChildren,
//   useRef,
//   useState,
// } from "react";
// import {
//   getAllCountriesRequest,
//   getAllCitiesRequest,
//   getAllStationsRequest,
//   getAllHsCodeRequest,
// } from "@/features/dashboard/services/New/location.service.ts";
//
// import { City, Country, HsCodeModel, Station } from "@/models/station.model.ts";
// import { VendorModel } from "@/features/dashboard/models/vendor.model.ts";
// import { getAllVendorsRequest } from "@/features/dashboard/services/New/vendors.service.ts";
//
// export const DataContext = createContext<{
//   store: {
//     countries?: Country[];
//     cities?: City[];
//     stations?: Station[];
//     hsCode?: HsCodeModel[];
//     vendors?: VendorModel[];
//   };
//   setStore: React.Dispatch<
//       React.SetStateAction<{
//         countries?: Country[];
//         cities?: City[];
//         stations?: Station[];
//         hsCode?: HsCodeModel[];
//       }>
//   >;
//
//   getData(names: string[], id?: number): Promise<any>;
//   resetData(name: string, id?: number): Promise<any>;
// }>({
//   store: {},
//   setStore: () => {},
//
//   getData: async () => {},
//   resetData: async () => {},
// });
//
// export const DataProvider = ({ children }: PropsWithChildren) => {
//   const fetchingRef = useRef<string[]>([]);
//   const [store, setStore] = useState<{
//     countries?: Country[];
//     cities?: City[];
//     stations?: Station[];
//     hsCode?: HsCodeModel[];
//     vendors?: VendorModel[];
//   }>({});
//
//   const getStoreData = async (name: string, id?: number) => {
//     switch (name) {
//       case "countries":
//         const { status: countryStatus, data: countryData } = await getAllCountriesRequest();
//         if (countryStatus === 200) return countryData;
//       case "cities":
//         const { status: cityStatus, data: cityData } = await getAllCitiesRequest(id);
//         if (cityStatus === 200) return cityData;
//       case "stations":
//         const { status: stationStatus, data: stationData } = await getAllStationsRequest(id);
//         if (stationStatus === 200) return stationData;
//       case "hsCode":
//         const { status: hsCodeStatus, data: hsCodeData } = await getAllHsCodeRequest();
//         if (hsCodeStatus === 200) return hsCodeData;
//       case "vendors":
//         const { status: vendorStatus, data: vendorData } = await getAllVendorsRequest();
//         if (vendorStatus === 200) return vendorData;
//       default:
//         return null;
//     }
//   };
//
//   const resetData = async (name: string, id: number) => {
//     setStore((prevState) => {
//       const { [name]: _, ...rest } = prevState;
//       return rest;
//     });
//
//     await getData([name], id);
//   };
//
//   const getData = async (names: string[], id: number) => {
//     const newValues: Record<string, any> = {};
//
//     // Sadece store'da olmayan ve sorgulanan veriler için işlem yap
//     const namesToFetch = names.filter((name) => {
//       // Eğer store'da veri varsa, yeniden sorgu yapma
//       return !store[name as keyof typeof store] && !fetchingRef.current.includes(name);
//     });
//
//     // İşaretleme: fetchingRef'i güncelle
//     fetchingRef.current.push(...namesToFetch);
//
//     // Verileri paralel olarak çek
//     const fetchPromises = namesToFetch.map((name) =>
//         getStoreData(name, id).then((data) => {
//           if (data) {
//             newValues[name] = data;
//           }
//         }),
//     );
//
//     await Promise.all(fetchPromises);
//
//     // fetchingRef temizleme
//     fetchingRef.current = fetchingRef.current.filter(
//         (name) => !namesToFetch.includes(name),
//     );
//
//     // Store'u güncelle
//     setStore((prevState) => ({ ...prevState, ...newValues }));
//   };
//
//   const data = {
//     store,
//     setStore,
//     getData,
//     resetData,
//   };
//
//   return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
// };
