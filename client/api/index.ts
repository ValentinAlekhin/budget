import axios from "axios";
import { useRenderEnv } from "~/hooks/useRenderEnv";

const api = axios.create();

export function useApi() {
  const {
    public: { baseUrl },
  } = useRuntimeConfig();
  const { isServer } = useRenderEnv();

  api.defaults.baseURL = isServer ? baseUrl : "/api";

  return { api, baseUrl };
}
