import { acceptHMRUpdate, defineStore, StateTree } from "pinia";
import { message } from "ant-design-vue";
import { RecordEntity } from "../../../server/src/record/record.entity";
import { useApi } from "~/api";
import { cudController } from "~/common/cud";

interface State {
  data: RecordEntity[];
  loading: boolean;
  error: Error | null | unknown;
}

export const useRecordStore = defineStore("record", {
  state: (): State => ({
    data: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAll() {
      const { api } = useApi();

      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.get("/records");
        this.data = data;
      } catch (e) {
        message.error("Ошибка при загрузке записей");
        this.error = e;
      } finally {
        this.loading = false;
      }
    },
    async init() {
      await this.cudInit();
      await this.fetchAll();
    },
    async addRecord(cost: { name: string; comment: string }) {
      const { api } = useApi();
      await api.post("/records", { ...cost, type: "cost" });
    },
    async addRecords(
      data: Array<{
        amount: number;
        comment?: string;
        category: string;
        type: string;
        timestamp: string;
      }>
    ) {
      const { api } = useApi();
      await api.post("/records/many", { data });
    },
    async delete(id: string) {
      const { api } = useApi();
      await api.delete(`/records/${id}`);
    },

    async update(body: any) {
      const { api } = useApi();
      await api.put(`/records/${body.id}`, body);
    },
    ...cudController({ action: "records" }),
  },
  getters: {
    costs: (state: State) => state.data.filter((r) => r.type === "cost"),
    dist: (state: State) => state.data.filter((r) => r.type === "dist"),
    inc: (state: State) => state.data.filter((r) => r.type === "inc"),
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRecordStore, import.meta.hot));
}
