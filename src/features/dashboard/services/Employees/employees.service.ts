import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";

const apiUrl = import.meta.env.VITE_API_URL;

export const getEmployees = async (
  page: number,
  pageSize: number,
  full_name: string,
  email: string,
  phone: string,
  role: string,
) => {
  return await axios
    .get(
      `${apiUrl}/admin/get-all-employee/?role=${role}&full_name=${full_name}&email=${email}&phone=${phone}&page=${page}&pageSize=${pageSize}`,
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

export const createEmployee = async (formData: FormData) => {
  return await axios
    .post(`${apiUrl}/admin/create-employee/`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const updateEmployee = async (formData: FormData, id: number) => {
  return await axios
    .put(`${apiUrl}/admin/update-employee/?id=${id}`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const deleteEmployee = async (id: number) => {
  return await axios
    .delete(`${apiUrl}/admin/delete-employee/?id=${id}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};
