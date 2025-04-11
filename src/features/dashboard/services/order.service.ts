import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";
const apiUrl = import.meta.env.VITE_API_URL;

// Get All Orders
export const getAllOrdersRequest = async (
  page: number,
  pageSize: number,
  id: string,
  name: string,
  email: string,
  phone: string,
  order_status: string,
) => {
  return await axios
    .get(
      `${apiUrl}/commercial/get-all-order/?page=${page}&pageSize=${pageSize}&id=${id}&full_name=${name}&email=${email}&phone=${phone}&order_status=${order_status}`,
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

// Order Get By ID
export const getByIdOrderRequest = async (id: number) => {
  return await axios
    .get(`${apiUrl}/commercial/get-by-order/?id=${id}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

// Order Create
export const postOrderCreateRequest = async (formData: FormData) => {
  return await axios
    .post(`${apiUrl}/commercial/create-order/`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

// User Orderi tesdiqleyir ya yox
export const getUserOrderApprovedRequest = async (
  orderId: number,
  is_approve: boolean,
  formData?: FormData,
) => {
  return await axios
    .post(
      `${apiUrl}/commercial/user-order-approve/?order_id=${orderId}&is_approve=${is_approve}`,
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

// Maliyeci Orderin Odenishin Tesdiqliyir
export const getAccountantOrderPaymentConfirmationRequest = async (
  orderId: number,
  is_approve: boolean,
) => {
  return await axios
    .get(
      `${apiUrl}/commercial/order-payment/?order_id=${orderId}&is_approve=${is_approve}`,
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

// Order Update
export const postOrderUpdateRequest = async (
  id: number,
  formData: FormData,
) => {
  return await axios
    .post(`${apiUrl}/commercial/update/?id=${id}`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

// Order Send
export const postSendOrderRequest = async (id: number) => {
  return await axios
    .get(`${apiUrl}/commercial/send-order/?id=${id}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

// Buyer Orderi tesdiqleyir
export const postInstructionDocumentRequest = async (
  formData: FormData,
  id: number,
) => {
  return await axios
    .post(`${apiUrl}/commercial/sales-add-code/?id=${id}`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

// Buyer Ordere Padcode elave edir
export const postBuyerAddPadCodeRequest = async (
  formData: FormData,
  id: number,
) => {
  return await axios
    .post(`${apiUrl}/commercial/buyers-approve/?id=${id}`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

// Hs Codlari Hamsini Filtileyib Gonderen Data
export const getAllHsCodeFilterRequest = async (code: string) => {
  return await axios
    .get(`${apiUrl}/commercial/get-all-hs/?hs=${code}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const getOrderInvoiceDetailRequest = async (id: number) => {
  return await axios
    .get(`${apiUrl}/commercial/get-invoice/?id=${id}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const getOrderInstructorDetailRequest = async (id: number) => {
  return await axios
    .get(`${apiUrl}/commercial/get-instructor/?id=${id}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

// role:Directory | Order Approve and Reject
export const getDirectoryApproveOrderRequest = async (
  order_id: number,
  approve_status: boolean,
) => {
  return await axios
    .get(
      `${apiUrl}/commercial/directory-approve-order/?order_id=${order_id}&approve=${approve_status}`,
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

export const postOrderPaymentRequest = async (
  formData: FormData,
  order_id: number,
) => {
  return await axios
    .post(
      `${apiUrl}/commercial/order-payment/?order_id=${order_id}`,
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
