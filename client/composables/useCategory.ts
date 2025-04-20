export function useCategory() {
  const { categoryStore } = useCategoryStore()
  const getCategory = (id: number) => categoryStore.getById(id)
  const getCategoryName = (id: number) =>
    getCategory(id)?.name || 'Не найдена'

  return { getCategoryName, getCategory }
}
