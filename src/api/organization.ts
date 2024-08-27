import axios from "axios";
import { Cookie } from "@src/utils";

export const GetOrganizations = async () => {
  try {
    const cookie = new Cookie();
    const baseURL = import.meta.env.VITE_NAIJA_COMPANIES_BASE_URL;
    const token = cookie.get("token");
    const response = await axios.get(`${baseURL}/organizations`, {
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

export const GetOrganization = async (query: string) => {
  try {
    const cookie = new Cookie();
    const baseURL = import.meta.env.VITE_NAIJA_COMPANIES_BASE_URL;
    const token = cookie.get("token");
    const response = await axios.get(`${baseURL}/organization?${query}`, {
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

export const AddOrganizations = async (companyData: any[]) => {
  try {
    const cookie = new Cookie();
    const baseURL = import.meta.env.VITE_NAIJA_COMPANIES_BASE_URL;
    const token = cookie.get("token");
    const response = await axios.post(`${baseURL}/organizations`, companyData, {
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
