import { api } from "~/api";

export default {
  async login(credentials: { username: string; password: string }) {
    try {
      const { data } = await api.post("/auth/login", credentials, {
        withCredentials: true,
      });

      const accessToken = useCookie("accessToken");
      accessToken.value = data.accessToken;

      const refreshToken = useCookie("refreshToken");
      refreshToken.value = data.refreshToken;

      // ElNotification({ title: 'Вы вошли', type: 'success' })

      api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;

      this.token = data.accessToken;
      await this.getMe();

      const router = useRouter();
      await router.push({ path: "/" });

      console.log("done");
    } catch (e) {
      console.log(e);
      // ElNotification({ title: 'Ошибка', message: String(e), type: 'error' })
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
    try {
      await api.post("/user", credentials);
      await this.login(credentials);
    } catch (e) {
      // ElNotification({ title: 'Ошибка', message: String(e), type: 'error' })
    }
  },
  async getMe() {
    try {
      const { data } = await api.get("/auth/me");

      this.user = data;
    } catch (e) {
      console.log(e);
    }
  },
};
