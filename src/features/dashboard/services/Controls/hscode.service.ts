import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";

const apiUrl = import.meta.env.VITE_API_URL;

export const HsCodeRequest = async (
  page: number,
  pageSize: number,
  cargo: string,
  code: string,
  description: string,
  created: string,
  updated: string,
) => {
  return await axios
    .get(
      `${apiUrl}/geography/all-hs/?page=${page}&pageSize=${pageSize}&cargo=${cargo}&code=${code}&description=${description}&created=${created}&updated=${updated}`,
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

export const HsCodeCreateRequest = async (formData: FormData) => {
  return await axios
    .post(`${apiUrl}/geography/created-hs/`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })

    .catch((err) => {
      return err.response;
    });
};

export const HsCodeUpdateRequest = async (formData: FormData, id: number) => {
  return await axios
    .put(`${apiUrl}/geography/update-hs/?id=${id}`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const HsCodeDeleteRequest = async (id: number) => {
  return await axios
    .delete(`${apiUrl}/geography/delete-hs/?id=${id}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })

    .catch((err) => {
      return err.response;
    });
};
