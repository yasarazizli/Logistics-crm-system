import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";

const apiUrl = import.meta.env.VITE_API_URL;

export const GetAllBuyers = async (params: {
  page: number;
  pageSize: number;
  service_name: string;
  location: string;
  transport_mode: string;
  transport_type: string;
  from_name: string;
  to_name: string;
}) => {
  return await axios
    .get(`${apiUrl}/commercial/get-all-quotation/`, {
      params,
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};
