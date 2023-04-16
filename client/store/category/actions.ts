import { message } from "ant-design-vue";
import { api } from "~/api";
import { cudController } from "~/common/cud";

export default {
  async fetchAll() {
    this.loading = true;
    this.error = null;

    try {
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
    try {
      await api.post("/category", category);
    } catch (e) {
      message.error("Ошибка при сохранении");
    }
  },
  async updateMany(
    data: Array<{ name: string; type: string; order: number; id: number }>
  ) {
    try {
      await api.put("/category/many", { data });
      message.success("Категории обновлены");
    } catch (e) {
      message.error("Ошибка при обновлении категорий");
    }
  },
  async delete(id: string) {
    try {
      await api.delete(`/category/${id}`);
    } catch (e) {
      message.error("Ошибка при удалении");
    }
  },
  ...cudController({ action: "category" }),
};
