import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";

const apiUrl = import.meta.env.VITE_API_URL;

export const getAccountantUser = async (
  page: number,
  pageSize: number,
  full_name: string,
  email: string,
  phone: string,
  company_name: string,
) => {
  return await axios
    .get(
      `${apiUrl}/accounts/get-all-user/?contract_status=all&page=${page}&pageSize=${pageSize}&full_name=${full_name}&email=${email}&phone=${phone}&company_name=${company_name}`,
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

export const addBalanceAccountant = async (formData: FormData, id: number) => {
  return await axios
    .put(`${apiUrl}/invoice/change-balance/?id=${id}`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};
