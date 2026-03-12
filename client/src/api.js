import axios from "axios";

export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
