export function useCategory() {
  const { categoryStore } = useCategoryStore()
  const getCategoryName = (id: number) =>
    categoryStore.getById(id)?.name || 'Не найдена'

  return { getCategoryName }
}
