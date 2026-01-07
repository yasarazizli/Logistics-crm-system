import axios from "axios";
import { getCookie, removeCookie } from "@/libs/cookie";
import i18n from "@/locales/i18n.ts";

let isRedirecting = false;

axios.interceptors.request.use((config) => {
  const token = getCookie("allianceToken");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.code;

    if (status === 403 && code === "USER_BLOCKED") {
      if (!isRedirecting) {
        isRedirecting = true;

        removeCookie("allianceToken");

        localStorage.setItem("USER_BLOCKED", "1");

        window.location.href = `/${i18n.language}/auth/login`;
      }
    }

    return Promise.reject(error);
  },
);
