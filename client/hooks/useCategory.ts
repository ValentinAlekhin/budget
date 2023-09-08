import { useCategoryStore } from "~/store/category";

export function useCategory() {
  const categoriesStore = useCategoryStore();
  const getCategoryName = (id: string) =>
    categoriesStore.getById(id)?.name || "Не найдена";

  return { getCategoryName };
}
