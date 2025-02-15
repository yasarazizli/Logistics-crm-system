import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";
const apiUrl = import.meta.env.VITE_API_URL;

export const getServiceNonSellingPriceRequest = async () => {
  return await axios
    .get(`${apiUrl}/buyers/get-services-sales/`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const addSellingPriceServicesRequest = async (
  data: FormData,
  id: number,
) => {
  return await axios
    .post(`${apiUrl}/buyers/add-price-service/?id=${id}`, data, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};
