import { useCookie } from "#app";
import { api } from "~/api";
import { useAuthStore } from "~/store/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const toAuth = to.path.includes("auth");
  const { value: token } = useCookie<string>("accessToken");
  const authStore = useAuthStore();

  if (!token && !toAuth) return navigateTo("/auth");

  api.defaults.headers.common.Authorization = `Bearer ${token}`;

  try {
    if (authStore.user) return;
    if (token) {
      await authStore.getMe();
      if (toAuth) return navigateTo("/");
    }
  } catch {
    authStore.logout();
    return navigateTo("/auth");
  }
});
