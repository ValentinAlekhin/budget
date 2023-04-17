import { useCookie } from "#app";
import { useApi } from "~/api";
import { useAuthStore } from "~/store/auth";
import { useGlobalLoading } from "~/hooks/useGlobalLoading";

export default defineNuxtRouteMiddleware(async (to) => {
  const { api } = useApi();
  const toAuth = to.path.includes("auth");
  const { value: token } = useCookie<string>("accessToken");
  const authStore = useAuthStore();

  if (!token && !toAuth) return navigateTo("/auth");

  api.defaults.headers.common.Authorization = `Bearer ${token}`;

  const { fetchAll } = useGlobalLoading();

  try {
    if (authStore.user) return;
    if (token) {
      await authStore.getMe();
      await fetchAll();
      if (toAuth) return navigateTo("/");
    }
  } catch {
    authStore.logout();
    return navigateTo("/auth");
  }
});
