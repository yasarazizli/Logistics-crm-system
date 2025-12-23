import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";

const apiUrl = import.meta.env.VITE_API_URL;

export const NotificationApi = async (id: number | undefined) => {
  return await axios
    .get(`${apiUrl}/notification/?user_id=${id}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const getAllNotifications = async (params: {
  page: number;
  pageSize: number;
  name: string;
  role: string;
  date?: string;
}) => {
  return await axios
    .get(`${apiUrl}/all-notification/`, {
      params,
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};
