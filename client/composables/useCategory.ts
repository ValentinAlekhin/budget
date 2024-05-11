import { useCategoryStore } from '~/store/category'

export function useCategory() {
  const { categoryStore } = useCategoryStore()
  const getCategoryName = (id: string) =>
    categoryStore.getById(id)?.name || 'Не найдена'

  return { getCategoryName }
}
