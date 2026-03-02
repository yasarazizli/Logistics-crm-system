import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";

const apiUrl = import.meta.env.VITE_API_URL;

export const getAllOrder = async (params: {
  order_code?: string;
  customer?: string;
  phone_number?: string;
  email?: string;
  country_loading?: string;
  country_destination?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  pageSize?: number;
}) => {
  return await axios
    .get(`${apiUrl}/commercial/get-all-order/`, {
      params,
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const createPrice = async (formData: FormData, order_id: number) => {
  return await axios
    .post(
      `${apiUrl}/commercial/send-quotation/?order_id=${order_id}`,
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

export const QuotationData = async (id: number) => {
  return await axios
    .get(`${apiUrl}/commercial/get-quotation/?id=${id}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const GetOffer = async (order_id: number) => {
  return await axios
    .get(`${apiUrl}/commercial/get-offer/?order_id=${order_id}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const UserData = async (order_id: number) => {
  return await axios
    .get(`${apiUrl}/commercial/get-user-order/?order_id=${order_id}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const sendSpecialist = async (order_id: number) => {
  return await axios
    .put(
      `${apiUrl}/commercial/send-specialist/?order_id=${order_id}`,
      {},
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

export const getOrderInvoiceDetailRequest = async (order_id: number) => {
  return await axios
    .get(`${apiUrl}/commercial/get-invoice/?order_id=${order_id}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const getOrderInstructionDetailRequest = async (order_id: number) => {
  return await axios
    .get(`${apiUrl}/commercial/get-instruction/?order_id=${order_id}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const ApproveDocument = async (formData: FormData, id: number) => {
  return await axios
    .post(`${apiUrl}/commercial/approve-user/?order_id=${id}`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const CloneOrder = async (id: number) => {
  return await axios
    .post(`${apiUrl}/commercial/clone-order/?order_id=${id}`, undefined, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const ApproveDocumentCm = async (formData: FormData, id: number) => {
  return await axios
    .post(`${apiUrl}/commercial/manager-approved/?order_id=${id}`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const OrderIdNo = async () => {
  return await axios
    .get(`${apiUrl}/commercial/get-all-orderNo/`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const ExtraChangeApi = async (formData: FormData) => {
  return await axios
    .post(`${apiUrl}/commercial/extra-cost/`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const getAllExtraChange = async (params: {
  order_no: string;
  service: string;
  total_quantity: string;
  purchase_price_per_ton: string;
  purchase_price_per_unit: string;
  unit: string;
  total_purchase_price: string;
  selling_price: string;
  total_selling_price: string;
  vat: string;
  profit: string;
  vendor: string;
  description: string;
  page?: number;
  pageSize?: number;
}) => {
  return await axios
    .get(`${apiUrl}/commercial/get-all-extra-cost/`, {
      params,
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const getExtraChange = async (id: number | null) => {
  return await axios
    .get(`${apiUrl}/commercial/get-extra-cost/?service_id=${id}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const updateExtraChange = async (
  formData: FormData,
  id: number | null,
) => {
  return await axios
    .put(`${apiUrl}/commercial/update-extra-cost/?service_id=${id}`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const updateExtraCost = async (
  formData: FormData,
  id: number | null,
) => {
  return await axios
    .put(`${apiUrl}/commercial/sales-extra-cost/?service_id=${id}`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};
