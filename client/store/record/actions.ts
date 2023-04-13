import { api } from "~/api";
import { cudController } from "~/common/cud";

export default {
  async fetchAll() {
    this.loading = true;
    this.error = null;

    try {
      const { data } = await api.get("/records");
      this.data = data;
    } catch (e) {
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
    const { data } = await api.post("/records", { ...cost, type: "cost" });
    this.data = [...this.data, data];
  },
  async delete(id: string) {
    await api.delete(`/records/${id}`);
  },

  async update(body: any) {
    const { data } = await api.put(`/records/${body.id}`, body);
    this.data = this.data.map((r) => (r.id === data.id ? data : r));
  },
  ...cudController({ action: "records" }),
};
