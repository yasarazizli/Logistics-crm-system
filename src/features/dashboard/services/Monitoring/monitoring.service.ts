import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";

const apiUrl = import.meta.env.VITE_API_URL;

export const MonitoringServiceEdit = async (formData: FormData, id: number) => {
  return await axios
    .put(`${apiUrl}/buyers/approve-monitoring/?id=${id}`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};
