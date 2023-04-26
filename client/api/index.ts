import axios from "axios";

const api = axios.create();

export function useApi() {
  const {
    public: { baseUrl },
  } = useRuntimeConfig();

  api.defaults.baseURL = !process.client ? baseUrl : "/api";

  api.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalConfig = err.config;
      const isAuthErr = err.response.status === 401;

      if (!isAuthErr || originalConfig._retry) return Promise.reject(err);

      originalConfig._retry = true;

      const refreshToken = useCookie("refreshToken");
      const accessToken = useCookie("accessToken");
      const router = useRouter();

      try {
        const { data } = await api.post("/auth/refresh-tokens", {
          refreshToken: refreshToken.value,
        });

        refreshToken.value = data.refreshToken;
        accessToken.value = data.accessToken;

        const authHeader = `Bearer ${data.accessToken}`;
        api.defaults.headers.common.Authorization = authHeader;
        originalConfig.headers.Authorization = authHeader;

        return api(originalConfig);
      } catch (e) {
        refreshToken.value = null;
        accessToken.value = null;
        await router.push("/auth");
        return Promise.reject(e);
      }
    }
  );

  return { api, baseUrl };
}
