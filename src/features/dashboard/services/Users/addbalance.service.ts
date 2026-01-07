import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";

const apiUrl = import.meta.env.VITE_API_URL;

export const addBalanceServices = async (formData: FormData) => {
  return await axios
    .put(`${apiUrl}/invoice/add-balance-user/`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const addContract = async (formData: FormData, id: number) => {
  return await axios
    .post(`${apiUrl}/accounts/add-contract/?id=${id}`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const EditUsers = async (formData: FormData, id: number) => {
  return await axios
    .put(`${apiUrl}/admin/update-user/?id=${id}`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};
