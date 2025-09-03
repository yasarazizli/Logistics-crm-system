import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";

const apiUrl = import.meta.env.VITE_API_URL;

export const GetAllCountry = async () => {
  return await axios
    .get(`${apiUrl}/geography/get-all-country/`, {
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

export const GetAllStationCode = async () => {
  return await axios
    .get(`${apiUrl}/geography/get-all-station/`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const GetAllPort = async () => {
  return await axios
    .get(`${apiUrl}/geography/get-all-port/`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};
