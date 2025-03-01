import axios from "axios";
import { loadState } from "./storage";

const MUALLIMAH_AUTH_API = import.meta.env.VITE_API_URL_AUTH;

const request = axios.create({
  baseURL: MUALLIMAH_AUTH_API,
});

request.interceptors.request.use((config) => {
  config.headers.Authorization = `${loadState("muallimah-user")?.access_token}`;
  return config;
});

request.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("muallimah-user");
      window.location.href = "/login";
    }

    return error;
  }
);

export { request };
