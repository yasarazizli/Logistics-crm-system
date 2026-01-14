import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";

const apiUrl = import.meta.env.VITE_API_URL;

export const GetAllCountry = async () => {
  return await axios
    .get(`${apiUrl}/geography/get-all-country/?page=1&pageSize=999`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const GetAllCity = async (country: string) => {
  return await axios
    .get(`${apiUrl}/geography/get-all-city/?country=${country}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const GetAllStationCode = async (country_name: string) => {
  return await axios
    .get(`${apiUrl}/geography/get-all-station/?country_name=${country_name}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const GetAllPort = async (country: string) => {
  return await axios
    .get(`${apiUrl}/geography/get-all-port/?country=${country}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};
