import axios, { AxiosError } from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_PATH as string | undefined,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Error BE selalu berbentuk { errors: string } — diseragamkan di sini jadi
// Error biasa, supaya hook tidak perlu parsing error per endpoint.
instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ errors?: string }>) => {
    const message =
      error.response?.data?.errors ?? error.message ?? "Terjadi kesalahan";
    return Promise.reject(new Error(message));
  },
);

export default instance;
