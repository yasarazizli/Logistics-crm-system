import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";
const apiUrl = import.meta.env.VITE_API_URL;

// Data context
export const getAllCountriesRequest = async (
  page?: number,
  pageSize?: number,
  name?: string,
) => {
  const params = {
    page: page || "",
    pageSize: pageSize || "",
    name: name || "",
  };

  return await axios
    .get(
      `${apiUrl}/country/get-all-countries/?page=${params.page}&pageSize=${params.pageSize}&name=${params.name}`,
      {
        headers: {
          Authorization: getCookie("allianceToken"),
        },
      },
    )
    .catch((err) => {
      return err.response;
    });
};

export const getAllCitiesRequest = async (
  country_id?: number,
  page?: number,
  pageSize?: number,
  name?: string,
) => {
  const params = {
    country_id: country_id || "",
    page: page || "",
    pageSize: pageSize || "",
    name: name || "",
  };

  return await axios
    .get(
      `${apiUrl}/country/get-all-cities/?country_id=${params.country_id}&page=${params.page}&pageSize=${params.pageSize}&name=${params.name}`,
      {
        headers: {
          Authorization: getCookie("allianceToken"),
        },
      },
    )
    .catch((err) => {
      return err.response;
    });
};

export const getAllStationsRequest = async (
  country_id?: number,
  country_name?: string,
  code?: string,
  page?: number,
  pageSize?: number,
) => {
  const params = {
    country_id: country_id || "",
    country_name: country_name || "",
    code: code || "",
    page: page || "",
    pageSize: pageSize || "",
  };

  return await axios
    .get(
      `${apiUrl}/station/get-all-station/?country_id=${params.country_id}&country_name=${params.country_name}&code=${params.code}&page=${params.page}&pageSize=${params.pageSize}`,
      {
        headers: {
          Authorization: getCookie("allianceToken"),
        },
      },
    )
    .catch((err) => {
      return err.response;
    });
};

export const getAllHsCodeRequest = async (
  page?: number | string,
  pageSize?: number | string,
  code?: string,
  cargo?: string,
) => {
  const params = {
    page: page || "",
    pageSize: pageSize || "",
    code: code || "",
    cargo: cargo || "",
  };

  return await axios
    .get(
      `${apiUrl}/commercial/get-all-hs/?page=${params.page}&pageSize=${params.pageSize}&code=${params.code}&cargo=${params.cargo}`,
      {
        headers: {
          Authorization: getCookie("allianceToken"),
        },
      },
    )
    .catch((err) => {
      return err.response;
    });
};
