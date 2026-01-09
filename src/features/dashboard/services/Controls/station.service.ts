import axios, { AxiosResponse } from "axios";
import { getCookie } from "@/libs/cookie.ts";

const apiUrl = import.meta.env.VITE_API_URL;

export const StationRequest = async (
  page: number,
  pageSize: number,
  name: string,
  code: string,
  country_name: string,
) => {
  return await axios
    .get(
      `${apiUrl}/geography/get-all-station/?page=${page}&pageSize=${pageSize}&country_name=${country_name}&code=${code}&name=${name}`,
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

export const StationCreateRequest = async (formData: FormData) => {
  return await axios
    .post(`${apiUrl}/geography/create-station/`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const StationDeleteRequest = async (id: number) => {
  return await axios
    .delete(`${apiUrl}/geography/delete-station/?id=${id}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export const StationUpdateRequest = async (formData: FormData, id: number) => {
  return await axios
    .put(`${apiUrl}/geography/update-station/?id=${id}`, formData, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};

export interface Country {
  id: number;
  name: string;
}

interface CountryApiResponse {
  data: Country[];
}

export const CountryFinder = async (
  name: string,
  page: number,
  pageSize: number,
): Promise<AxiosResponse<CountryApiResponse> | undefined> => {
  try {
    const response = await axios.get<CountryApiResponse>(
      `${apiUrl}/geography/get-all-country/?name=${name}&page=${page}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: getCookie("allianceToken"),
        },
      },
    );
    return response;
  } catch (err: any) {
    return err.response;
  }
};
