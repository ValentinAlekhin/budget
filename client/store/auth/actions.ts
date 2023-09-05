import { useApi } from "~/api";
import { useGlobalLoading } from "~/hooks/useGlobalLoading";
import { useNotify } from "~/hooks/useNotify";

export default {
  async login(credentials: { username: string; password: string }) {
    const notify = useNotify();

    try {
      const { api } = useApi();

      const { data } = await api.post("/auth/login", credentials, {
        withCredentials: true,
      });

      const accessToken = useCookie("accessToken");
      accessToken.value = data.accessToken;

      const refreshToken = useCookie("refreshToken");
      refreshToken.value = data.refreshToken;

      api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;

      this.token = data.accessToken;
      await this.getMe();

      const router = useRouter();
      await router.push({ path: "/" });

      notify.success("Вы вошли");

      const { fetchAll } = useGlobalLoading();
      await fetchAll();
    } catch (e) {
      notify.error("Невалидные данные");
    }
  },
  logout() {
    this.$reset();

    const accessToken = useCookie("accessToken");
    accessToken.value = null;

    const refreshToken = useCookie("refreshToken");
    refreshToken.value = null;

    const router = useRouter();
    router.push({ path: "/auth" });
  },
  async register(credentials: {
    username: string;
    password: string;
    email: string;
  }) {
    const { api } = useApi();
    const notify = useNotify();

    try {
      await api.post("/user", credentials);
      await this.login(credentials);
    } catch (e) {
      notify.error("Ошибка при регистарции");
    }
  },
  async getMe() {
    const { api } = useApi();
    const { data } = await api.get("/auth/me");

    this.user = data;
  },
};
