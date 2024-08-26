import axios from "axios";

export const Login = async ({
  user,
  password,
}: {
  user: string;
  password: string;
}) => {
  try {
    const baseURL = import.meta.env.VITE_NAIJA_COMPANIES_BASE_URL;
    const response = await axios.post(`${baseURL}/login`, { user, password });

    const { data, status } = response;
    return { data, status };
  } catch (error) {
    return { status: 500, data: error };
  }
};
