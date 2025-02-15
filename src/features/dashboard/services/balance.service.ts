import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";
const apiUrl = import.meta.env.VITE_API_URL;

// role:Admin,Accountant,Directory | Get All Balance Activities
export const getUserBalanceActivitiesRequest = async (
  page: number,
  pageSize: number,
  process_type: string,
  invoice_status: string,
  name: string,
  amount_min: string,
  amount_max: string,
  start_date: string,
  end_date: string,
) => {
  return await axios
    .get(
      `${apiUrl}/invoice/get-all-invoice/?page=${page}&pageSize=${pageSize}&user=${name}&process_type=${process_type}&amount_min=${amount_min}&amount_max=${amount_max}&invoice_status=${invoice_status}&start_date=${start_date}&end_date=${end_date}`,
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

// role:Admin,Accountant | The accountant approves the user's balance increase.
export const getAccountantApprovedRequest = async (
  id: number,
  approve: boolean,
) => {
  return await axios
    .get(`${apiUrl}/invoice/approve-invoice/?id=${id}&approve=${approve}`, {
      headers: {
        Authorization: getCookie("allianceToken"),
      },
    })
    .catch((err) => {
      return err.response;
    });
};
