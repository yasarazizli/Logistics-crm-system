import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";

const apiUrl = import.meta.env.VITE_API_URL;

export const getAllOrder = async (params: {
  order_code?: string;
  customer?: string;
  phone_number?: string;
  email?: string;
  country_loading?: string;
  country_destination?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  pageSize?: number;
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

export const createPrice = async (formData: FormData, order_id: number) => {
  return await axios
    .post(
      `${apiUrl}/commercial/send-quotation/?order_id=${order_id}`,
      formData,
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

export const QuotationData = async (id: number) => {
  return await axios
    .get(`${apiUrl}/commercial/get-quotation/?id=${id}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};
