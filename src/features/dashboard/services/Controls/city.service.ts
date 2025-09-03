import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";

const apiUrl = import.meta.env.VITE_API_URL;

export const CityRequest = async (
  page: number,
  pageSize: number,
  name: string,
  country: string,
) => {
  return await axios
    .get(
      `${apiUrl}/geography/get-all-city/?&page=${page}&pageSize=${pageSize}&name=${name}&country=${country}`,
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

export const CityCreateRequest = async (formData: FormData) => {
  return await axios
    .post(`${apiUrl}/geography/create-city/`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const CityUpdateRequest = async (formData: FormData, id: number) => {
  return await axios
    .put(`${apiUrl}/geography/update-city/?id=${id}`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const CityDeleteRequest = async (id: number) => {
  return await axios
    .delete(`${apiUrl}/geography/delete-city/?id=${id}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};
