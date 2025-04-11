import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";
const apiUrl = import.meta.env.VITE_API_URL;

//  Get All User
export const getAllUsersRequest = async (
  page: number,
  pageSize?: number,
  name?: string,
  email?: string,
  phone?: string,
  identity_number?: string,
  company_name?: string,
  manager?: string,
  start_date?: string,
  end_date?: string,
  contract_status?: string,
) => {
  const params = {
    page: page,
    pageSize: pageSize,
    name: name || "",
    phone: phone || "",
    email: email || "",
    identity_number: identity_number || "",
    company_name: company_name || "",
    manager: manager || "",
    start_date: start_date || "",
    end_date: end_date || "",
    contract_status: contract_status || "all",
  };

  return await axios
    .get(
      `${apiUrl}/accounts/get-all-user/?page=${params.page}&pageSize=${params.pageSize}&full_name=${params.name}&phone=${params.phone}&email=${params.email}&identity_number=${params.identity_number}&company_name=${params.company_name}&manager=${params.manager}&start_date=${params.start_date}&end_date=${params.end_date}&contract_status=${params.contract_status}`,
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

// role:User | User Add Contract
export const postAddUserContractRequest = async (
  formData: FormData,
  id?: number,
) => {
  return await axios
    .post(`${apiUrl}/accounts/add-contract/?id=${id}`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

// role:accountant | Change User Balance
export const postChangeUserBalanceRequest = async (
  formData: FormData,
  id: number,
) => {
  return await axios
    .post(`${apiUrl}/invoice/change-balance/?id=${id}`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

// role:User | User Add Balance
export const postAddUserBalanceRequest = async (formData: FormData) => {
  return await axios
    .post(`${apiUrl}/invoice/add-balance-user/`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

// role:Lawyer | User Verified Contract
export const postVerifiedUserContractRequest = async (
  formData: FormData,
  id: number,
) => {
  return await axios
    .post(`${apiUrl}/lawyer/verified-user-contract/?id=${id}`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

// role:Lawyer | User Deleted Contract
export const postDeleteUserContractRequest = async (id: number) => {
  return await axios
    .get(`${apiUrl}/lawyer/delete-user-contract/?id=${id}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

// role:Admin | Assign Accountant To User
export const postAssignAccountantToUserRequest = async (formData: FormData) => {
  return await axios
    .post(`${apiUrl}/admin/assign-accountant/`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

// role:Admin , Commercial Directory | Assign Accountant To User
export const postAppointCommercialManagerRequest = async (
  formData: FormData,
) => {
  return await axios
    .post(`${apiUrl}/commercial/task-worker/`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const postAdminCreateUserRequest = async (formData: FormData) => {
  return await axios
    .post(`${apiUrl}/accounts/create-user/`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const postAdminUpdateUserRequest = async (
  formData: FormData,
  user_id: number,
) => {
  return await axios
    .post(`${apiUrl}/accounts/update-user/?id=${user_id}`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const deleteAdminUserRequest = async (id: number) => {
  return await axios
    .get(`${apiUrl}/accounts/delete-user/?id=${id}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};
