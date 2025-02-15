import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";
const apiUrl = import.meta.env.VITE_API_URL;

// ---Services---

// Get All Vendor Services
export const getAllServicesRequest = async (
  page?: string | number,
  pageSize?: string | number,
  name?: string,
  contract_status?: string,
  start_date?: string,
  end_date?: string,
) => {
  const params = {
    page: page || "",
    pageSize: pageSize || "",
    name: name || "",
    start_date: start_date || "",
    end_date: end_date || "",
    contract_status: contract_status || "all",
  };

  return await axios
    .get(
      `${apiUrl}/buyers/get-all-service/?page=${params.page}&pageSize=${params.pageSize}&name=${params.name}&start_date=${params.start_date}&end_date=${params.end_date}&contract_status=${params.contract_status}`,
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

// role:Admin,Buyer | Service Create
export const postServiceCreateRequest = async (formData: FormData) => {
  return await axios
    .post(`${apiUrl}/buyers/create-vendor-service/`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

// role:Admin,Commercial Manager | Missing Services
export const postAddMissingServicesRequest = async (formData: FormData) => {
  return await axios
    .post(`${apiUrl}/commercial/add-missing-services/`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

// role:Admin,Lawyer | Service Verified Contract
export const getServiceVerifiedContractRequest = async (id: number) => {
  return await axios
    .get(`${apiUrl}/lawyer/verified-vendor-service/?id=${id}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

// role:Admin,Lawyer | Service Deleted Contract
export const getServiceDeletedContractRequest = async (id: number) => {
  return await axios
    .get(`${apiUrl}/lawyer/delete-vendor-service-contract/?id=${id}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};
