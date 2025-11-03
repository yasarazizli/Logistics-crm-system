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

export const addPayment = async (formData: FormData, order_id: number) => {
  return await axios
    .put(`${apiUrl}/commercial/pay-order/?order_id=${order_id}`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const getAllInvoices = async (params: {
  page: number;
  pageSize: number;
  invoice_status: string;
  user: string;
  date?: string;
  amount: string;
  not: string;
}) => {
  return await axios
    .get(`${apiUrl}/invoice/get-all-invoice/`, {
      params,
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const EditBalance = async (formData: FormData, id: number) => {
  return await axios
    .put(`${apiUrl}/invoice/approve-invoice/?id=${id}`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const DebtOrder = async (params: {
  page: number;
  pageSize: number;
  order_code: string;
  customer: string;
  phone_number: string;
  email: string;
  country_loading: string;
  country_destination?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  payment_status?: string;
}) => {
  return await axios
    .get(`${apiUrl}/commercial/get-all-order/`, {
      params,
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const FullOrder = async (params: {
  page: number;
  pageSize: number;
  order_code: string;
  customer: string;
  phone_number: string;
  email: string;
  country_loading: string;
  country_destination?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  payment_status?: string;
}) => {
  return await axios
    .get(`${apiUrl}/commercial/get-all-order/`, {
      params,
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const EditOrder = async (formData: FormData, order_id: number) => {
  return await axios
    .put(`${apiUrl}/accountant-approve/?order_id=${order_id}`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};
