import { Cookie } from "@src/utils";
import axios from "axios";

export const GetIndustries = async () => {
  try {
    const cookie = new Cookie();
    const baseURL = import.meta.env.VITE_NAIJA_COMPANIES_BASE_URL;
    const token = cookie.get("token");
    const response = await axios.get(`${baseURL}/industries`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { status, data } = response;
    return { status, data };
  } catch (error) {
    return { status: 500, data: error };
  }
};
