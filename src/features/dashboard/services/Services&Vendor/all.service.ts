import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";
const apiUrl = import.meta.env.VITE_API_URL;

export const getAllServices = async (params: {
  country_name?: string;
  vendor_name?: string;
  location?: string;
  service_name?: string;
  transport_mode?: string;
  hs_code_name?: string;
  from_name?: string;
  to_name?: string;
  transport_type?: string;
  purchase_price_ton?: string;
  purchase_price_unit?: string;
  page?: number;
  pageSize?: number;
}) => {
  return await axios
    .get(`${apiUrl}/buyers/get-all-service/`, {
      params,
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const createVendor = async (formData: FormData) => {
  return await axios
    .post(`${apiUrl}/buyers/create-vendor/`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const createServices = async (formData: FormData) => {
  return await axios
    .post(`${apiUrl}/buyers/create-service/`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const getAllVendors = async () => {
  return await axios
    .get(
      `${apiUrl}/buyers/get-all-vendor/?contract_status&name&start_date&end_date`,
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

export const allHsCode = async () => {
  return await axios
    .get(
      `${apiUrl}/geography/all-hs/?page=&pageSize=&cargo=&code=&description=&created=&updated=`,
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

export const getAllCountry = async () => {
  return await axios
    .get(
      `${apiUrl}/geography/get-all-country/?name=&page=1&pageSize=999&date=`,
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

export const getVendorRequest = async (params: {
  contract_status?: string;
  name?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  pageSize?: number;
}) => {
  return await axios
    .get(`${apiUrl}/buyers/get-all-vendor/`, {
      params,
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const getAllStationCode = async () => {
  return await axios
    .get(
      `${apiUrl}/geography/get-all-station/?page=&pageSize=&country_name=&code=&name=`,
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

export const getAllPort = async () => {
  return await axios
    .get(`${apiUrl}/geography/get-all-port/?country=&name=&page=&pageSize=`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const getAllServicesName = async () => {
  return await axios
    .get(`${apiUrl}/buyers/all-service-name/?name`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const getAllServicesData = async (id: number | null) => {
  return await axios
    .get(`${apiUrl}/commercial/get-quotation-trans-data/?id=${id}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const ServicesData = async (id: number) => {
  return await axios
    .get(`${apiUrl}/buyers/get-service/?id=${id}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const EditServices = async (formData: FormData, id: number) => {
  return await axios
    .post(`${apiUrl}/buyers/update-service/?id=${id}`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};
