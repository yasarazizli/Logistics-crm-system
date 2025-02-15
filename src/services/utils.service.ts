import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";
const apiUrl = import.meta.env.VITE_API_URL;

export const getCityIdByStationRequest = async (id: number) => {
  return await axios
    .get(`${apiUrl}/station/get-all-id-station/?city_id=${id}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const getAllStationRequest = async () => {
  return await axios
    .get(`${apiUrl}/station/get-all-station/`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};
