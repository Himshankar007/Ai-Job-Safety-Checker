import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export function getApiErrorMessage(err) {
  const status = err?.response?.status;
  const data = err?.response?.data;

  if (status === 402) {
    const msg =
      data?.detail?.message ||
      data?.message ||
      "This feature is under maintenance (payment required).";
    return msg;
  }

  if (status && data?.detail) return `${status}: ${JSON.stringify(data.detail)}`;
  if (status && data?.message) return `${status}: ${data.message}`;
  if (err?.message) return err.message;
  return "Request failed. Please try again.";
}
