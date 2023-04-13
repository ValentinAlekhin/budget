import { api } from "~/api";
import { useAuthStore } from "~/store/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  const toAuth = to.path.includes("auth");

  if (!authStore.computedToken && !toAuth) return navigateTo("/auth");

  api.defaults.headers.common.Authorization = `Bearer ${authStore.computedToken}`;

  try {
    if (authStore.user) return;
    await authStore.getMe();
    if (toAuth) return navigateTo("/");
  } catch {
    authStore.logout();
    return navigateTo("/auth");
  }
});
