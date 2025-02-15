import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";
const apiUrl = import.meta.env.VITE_API_URL;

// ---Tasks---

// role:Buyer | Get All Tasks
export const getAllBuyerTasksRequest = async (option: string) => {
  return await axios
    .get(`${apiUrl}/commercial/get-all-missing-services/?option=${option}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

// role:Buyer | Accept Tasks
export const getBuyerAcceptTaskRequest = async (serviceId: number) => {
  return await axios
    .get(`${apiUrl}/commercial/accept-task/?service_id=${serviceId}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

// role:Buyer | Completed Tasks
export const getBuyerCompletedTaskRequest = async (serviceId: number) => {
  return await axios
    .get(
      `${apiUrl}/commercial/missing-services-approve/?service_id=${serviceId}`,
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

// ---Vendors---

// role:Buyer | Get All Verified Vendors Contracts
export const getVerifiedVendorsContractsRequest = async (
  page: number,
  name: string,
  start_date: string,
  end_date: string,
) => {
  return await axios
    .get(
      `${apiUrl}/buyers/get-all-verify-vendor/?page=${page}&pageSize=10&name=${name}&start_date=${start_date}&end_date=${end_date}`,
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

// role:Buyer | Get All Pending Approval Vendors Contracts
export const getPendingApprovalVendorsContractsRequest = async (
  page: number,
  name: string,
  start_date: string,
  end_date: string,
) => {
  return await axios
    .get(
      `${apiUrl}/buyers/get-all-unverify-vendor/?page=${page}&pageSize=10&name=${name}&start_date=${start_date}&end_date=${end_date}`,
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

// role:Buyer | Get All Empty Vendors Contracts
export const getEmptyVendorsContractsRequest = async (
  page: number,
  name: string,
  start_date: string,
  end_date: string,
) => {
  return await axios
    .get(
      `${apiUrl}/buyers/get-all-empty-vendor/?page=${page}&pageSize=10&name=${name}&start_date=${start_date}&end_date=${end_date}`,
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

// ---Service---

// role:Buyer | Get All Verified VService
export const getAllVerifiedServiceRequest = async (
  page: number,
  pageSize: number,
  name: string,
  contract_start_date: string,
  contract_end_date: string,
  country: string,
  vendor: string,
  raw_cost_min: string,
  raw_cost_max: string,
  selling_price_min: string,
  selling_price_max: string,
) => {
  return await axios
    .get(
      `${apiUrl}/buyers/get-all-verify-vendor-services/?page=${page}&pageSize=${pageSize}&name=${name}&contract_start_date=${contract_start_date}&contract_end_date=${contract_end_date}&country=${country}&vendor=${vendor}&raw_cost_min=${raw_cost_min}&raw_cost_max=${raw_cost_max}&selling_price_min=${selling_price_min}&selling_price_max=${selling_price_max}`,
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

// role:Buyer | Get All Pending Approval Service
export const getPendingApprovalServiceRequest = async (
  page: number,
  pageSize: number,
  name: string,
  contract_start_date: string,
  contract_end_date: string,
  country: string,
  vendor: string,
  raw_cost_min: string,
  raw_cost_max: string,
  selling_price_min: string,
  selling_price_max: string,
) => {
  return await axios
    .get(
      `${apiUrl}/buyers/get-all-unverify-vendor-services/?page=${page}&pageSize=${pageSize}&name=${name}&contract_start_date=${contract_start_date}&contract_end_date=${contract_end_date}&country=${country}&vendor=${vendor}&raw_cost_min=${raw_cost_min}&raw_cost_max=${raw_cost_max}&selling_price_min=${selling_price_min}&selling_price_max=${selling_price_max}`,
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

// role:Buyer | Get All No Contract Service
export const getNoContractServicesRequest = async (
  page: number,
  pageSize: number,
  name: string,
  contract_start_date: string,
  contract_end_date: string,
  country: string,
  vendor: string,
  raw_cost_min: string,
  raw_cost_max: string,
  selling_price_min: string,
  selling_price_max: string,
) => {
  return await axios
    .get(
      `${apiUrl}/buyers/get-all-empty-vendor-services/?page=${page}&pageSize=${pageSize}&name=${name}&contract_start_date=${contract_start_date}&contract_end_date=${contract_end_date}&country=${country}&vendor=${vendor}&raw_cost_min=${raw_cost_min}&raw_cost_max=${raw_cost_max}&selling_price_min=${selling_price_min}&selling_price_max=${selling_price_max}`,
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
