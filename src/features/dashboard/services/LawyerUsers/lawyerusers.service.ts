import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";

const apiUrl = import.meta.env.VITE_API_URL;

export const getLawyerUser = async (
  page: number,
  pageSize: number,
  full_name: string,
  email: string,
  phone: string,
  company_name: string,
  contract_status: string,
) => {
  return await axios
    .get(
      `${apiUrl}/accounts/get-all-user/?contract_status=${contract_status}&page=${page}&pageSize=${pageSize}&full_name=${full_name}&email=${email}&phone=${phone}&company_name=${company_name}`,
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

export const postLawyerUser = async (formData: FormData, id: number) => {
  return await axios
    .post(`${apiUrl}/lawyer/verified-user-contract/?id=${id}`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const deleteLawyer = async (id: number) => {
  return await axios
    .delete(`${apiUrl}/lawyer/delete-user-contract/?id=${id}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};
