import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";

const apiUrl = import.meta.env.VITE_API_URL;

export const CountryRequest = async (
  page: number,
  pageSize: number,
  name: string,
  date: string,
) => {
  return await axios
    .get(
      `${apiUrl}/geography/get-all-country/?name=${name}&page=${page}&pageSize=${pageSize}&date=${date}`,
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

export const CountryCreateRequest = async (formData: FormData) => {
  return await axios
    .post(`${apiUrl}/geography/create-country/`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const CountryUpdateRequest = async (formData: FormData, id: number) => {
  return await axios
    .put(`${apiUrl}/geography/update-country/?id=${id}`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const CountryDeleteRequest = async (id: number) => {
  return await axios
    .delete(`${apiUrl}/geography/delete-country/?id=${id}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};
