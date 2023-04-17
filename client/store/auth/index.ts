import { acceptHMRUpdate, defineStore } from "pinia";
import state from "~/store/auth/state";
import actions from "~/store/auth/actions";
import getters from "~/store/auth/getters";

export const useAuthStore = defineStore("auth", {
  state,
  actions,
  getters,
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
