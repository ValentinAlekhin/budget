import { useApi } from "~/api";
import { cudController } from "~/common/cud";
import { useNotify } from "~/hooks/useNotify";

export default {
  async fetchAll() {
    this.loading = true;
    this.error = null;

    try {
      if (this.data?.length) return;

      const { api } = useApi();
      const { data } = await api.get("/category");
      this.data = data.map((c) => ({ ...c, name: c.name.slice(0, 12) }));
    } catch (e) {
      const notify = useNotify();
      notify.error("Ошибка при загрузке категорий");
      this.error = e;
    } finally {
      this.loading = false;
    }
  },
  async init() {
    await this.cudInit();
    await this.fetchAll();
  },
  async addCategory(category: { name: string; type: string; order: number }) {
    const { api } = useApi();
    try {
      await api.post("/category", category);
    } catch (e) {
      const notify = useNotify();
      notify.error("Ошибка при сохранении");
    }
  },
  async updateMany(
    data: Array<{ name: string; type: string; order: number; id: number }>
  ) {
    const { api } = useApi();
    try {
      await api.put("/category/many", { data });
    } catch (e) {
      const notify = useNotify();
      notify.error("Ошибка при обновлении категорий");
    }
  },
  async delete(id: string) {
    const { api } = useApi();
    try {
      await api.delete(`/category/${id}`);
    } catch (e) {
      const notify = useNotify();
      notify.error("Ошибка при удалении");
    }
  },
  ...cudController({ action: "category" }),
};
