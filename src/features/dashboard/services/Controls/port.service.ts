import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";

const apiUrl = import.meta.env.VITE_API_URL;

export const PortRequest = async (
  page: number,
  pageSize: number,
  name: string,
  country: string,
) => {
  return await axios
    .get(
      `${apiUrl}/geography/get-all-port/?country=${country}&name=${name}&page=${page}&pageSize=${pageSize}`,
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

export const PortCreateRequest = async (formData: FormData) => {
  return await axios
    .post(`${apiUrl}/geography/create-port/`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const PortUpdateRequest = async (formData: FormData, id: number) => {
  return await axios
    .put(`${apiUrl}/geography/update-port/?id=${id}`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const PortDeleteRequest = async (id: number) => {
  return await axios
    .delete(`${apiUrl}/geography/delete-port/?id=${id}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};
