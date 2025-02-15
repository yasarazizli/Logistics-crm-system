import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";
const apiUrl = import.meta.env.VITE_API_URL;

// Login
export const loginRequest = async (data: FormData) => {
  return await axios.post(`${apiUrl}/accounts/login/`, data).catch((err) => {
    return err.response;
  });
};

// Check
export const checkRequest = async () => {
  return await axios
    .get(`${apiUrl}/accounts/check-user/`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((error) => {
      return error;
    });
};

// Log out
export const logoutRequest = async () => {
  return await axios
    .get(`${apiUrl}/accounts/logout/`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

// Register
export const registerRequest = async (data: FormData) => {
  return await axios.post(`${apiUrl}/accounts/register/`, data).catch((err) => {
    return err.response;
  });
};

// Register Verify
export const registerVerifyResponse = async (token: string) => {
  return await axios
    .get(`${apiUrl}/accounts/verify/?token=${token}`)
    .catch((err) => {
      return err.response;
    });
};

// Register & Un Authorized Order Create
export const postUnAuthorizedOrderRequest = async (formData: FormData) => {
  return await axios
    .post(`${apiUrl}/commercial/price-quotation/`, formData)
    .catch((err) => {
      return err.response;
    });
};

// Change Password
export const postChangePasswordRequest = async (formData: FormData) => {
  return await axios
    .post(`${apiUrl}/accounts/change-password/`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

// Forget Password
export const postForgetPasswordRequest = async (formData: FormData) => {
  return await axios
    .post(`${apiUrl}/accounts/forget-password/`, formData)
    .catch((err) => {
      return err.response;
    });
};

//
export const postResetPasswordRequest = async (formData: FormData) => {
  return await axios
    .post(`${apiUrl}/accounts/reset-password/`, formData)
    .catch((err) => {
      return err.response;
    });
};
