import { message } from "ant-design-vue";
import { useApi } from "~/api";
import { cudController } from "~/common/cud";

export default {
  async fetchAll() {
    this.loading = true;
    this.error = null;

    try {
      const { api } = useApi();
      const { data } = await api.get("/category");
      this.data = data;
    } catch (e) {
      message.error("Ошибка при загрузке категорий");
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
      message.error("Ошибка при сохранении");
    }
  },
  async updateMany(
    data: Array<{ name: string; type: string; order: number; id: number }>
  ) {
    const { api } = useApi();
    try {
      await api.put("/category/many", { data });
      message.success("Категории обновлены");
    } catch (e) {
      message.error("Ошибка при обновлении категорий");
    }
  },
  async delete(id: string) {
    const { api } = useApi();
    try {
      await api.delete(`/category/${id}`);
    } catch (e) {
      message.error("Ошибка при удалении");
    }
  },
  ...cudController({ action: "category" }),
};
