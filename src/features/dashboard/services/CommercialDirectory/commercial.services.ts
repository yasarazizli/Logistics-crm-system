import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";

const apiUrl = import.meta.env.VITE_API_URL;

export const getAllUsers = async (params: {
  full_name?: string;
  email?: string;
  phone?: string;
  company_name?: string;
  start_date?: string;
  end_date?: string;
  balance?: string;
  page?: number;
  pageSize?: number;
}) => {
  return await axios
    .get(`${apiUrl}/accounts/get-all-user/?contract_status=all`, {
      params,
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const putSellingPrice = async (formData: FormData, id: number) => {
  return await axios
    .put(`${apiUrl}/buyers/add-price-service/?id=${id}`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const putApprovePrice = async (id: number) => {
  return await axios
    .put(`${apiUrl}/buyers/approve-service/?id=${id}`, null, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};
