import { api } from "~/api";

export default {
  async fetchAll() {
    this.loading = true;
    this.error = null;

    try {
      const { data } = await api.get("/category");
      this.data = data;
    } catch (e) {
      this.error = e;
    } finally {
      this.loading = false;
    }
  },
  async addCost(cost: { name: string; comment: string }) {
    const { data } = await api.post("/category", { ...cost, type: "cost" });
    this.data = [...this.data, data];
  },
};
