import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";
const apiUrl = import.meta.env.VITE_API_URL;

// role:Admin,Buyer | Service Create
export const getAllNotificationRequest = async () => {
  return await axios
    .get(`${apiUrl}/notification/get-notification/`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};
