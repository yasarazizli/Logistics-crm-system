import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";
const apiUrl = import.meta.env.VITE_API_URL;

// Vendors

//  Get All User Contract
export const getAllVendorsRequest = async (
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
      `${apiUrl}/buyers/get-all-vendor/?page=${params.page}&pageSize=${params.pageSize}&name=${params.name}&start_date=${params.start_date}&end_date=${params.end_date}&contract_status=${params.contract_status}`,
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

// role:Admin,Buyer | Create Vendors
export const postVendorCreateRequest = async (formData: FormData) => {
  return await axios
    .post(`${apiUrl}/buyers/create-vendor/`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

// role:Admin,Buyer | Create Vendors
export const postVendorContractActivateRequest = async (
  formData: FormData,
  id: number,
) => {
  return await axios
    .post(`${apiUrl}/buyers/activate-vendor/?id=${id}`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

// role:Admin,Lawyer | Vendor Verified Contract
export const postVendorContractApprovalRequest = async (id: number) => {
  return await axios
    .get(`${apiUrl}/lawyer/verified-vendor/?id=${id}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

// role:Admin,Lawyer | Vendor Deleted Contract
export const postVendorContractDeleteRequest = async (id: number) => {
  return await axios
    .get(`${apiUrl}/lawyer/delete-vendor-contract/?id=${id}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};
