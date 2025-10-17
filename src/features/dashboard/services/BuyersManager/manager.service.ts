import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";

const apiUrl = import.meta.env.VITE_API_URL;

export const CompletedRequest = async (quotation_id: number) => {
  return await axios
    .put(
      `${apiUrl}/commercial/approve-service-quotation/?quotation_id=${quotation_id}`,
      null,
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
