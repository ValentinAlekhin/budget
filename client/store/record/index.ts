import { acceptHMRUpdate, defineStore } from "pinia";
import state from "~/store/record/state";
import actions from "~/store/record/actions";
import getters from "~/store/record/getters";

export const useRecordStore = defineStore("record", {
  state,
  actions,
  getters,
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRecordStore, import.meta.hot));
}
