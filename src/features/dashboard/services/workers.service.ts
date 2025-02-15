import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";
const apiUrl = import.meta.env.VITE_API_URL;

//  Get All User Contract
export const getAllWorkersRequest = async (
  page: number | string,
  pageSize?: number | string,
  name?: string,
  email?: string,
  phone?: string,
  role?: string,
) => {
  const params = {
    page: page,
    pageSize: pageSize,
    name: name || "",
    email: email || "",
    phone: phone || "",
    role: role || "lawyer",
  };

  return await axios
    .get(
      `${apiUrl}/admin/get-all-workers/?page=${params.page}&pageSize=${params.pageSize}&name=${params.name}&email=${params.email}&phone=${params.phone}&role=${params.role}`,
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

// role:Admin | Create Worker
export const postWorkerCreateRequest = async (formData: FormData) => {
  return await axios
    .post(`${apiUrl}/admin/create-workers/`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

// role:Admin | Update Worker
export const postWorkerUpdateRequest = async (
  worker_id: number,
  formData: FormData,
) => {
  return await axios
    .post(`${apiUrl}/admin/update-worker/?id=${worker_id}`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

// role:Admin | Delete Worker
export const postDeleteWorkersRequest = async (worker_id: number) => {
  return await axios
    .get(`${apiUrl}/admin/delete-worker/?id=${worker_id}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

// role:Admin,Commercial Directory | Get All Commercial Manager
export const getAllCommercialManagerRequest = async () => {
  return await axios
    .get(`${apiUrl}/accounts/get-commercial-manager/`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

// role:Admin,Commercial Directory | Get All Accountant
export const getAllAccountantRequest = async () => {
  return await axios
    .get(`${apiUrl}/accounts/admin/all-accountant/`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};
