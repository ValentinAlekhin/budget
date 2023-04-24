import axios from "axios";

const api = axios.create();

export function useApi() {
  const {
    public: { baseUrl },
  } = useRuntimeConfig();

  api.defaults.baseURL = !process.client ? baseUrl : "/api";

  return { api, baseUrl };
}
