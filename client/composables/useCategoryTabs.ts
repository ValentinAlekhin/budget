import { useLocalStorage } from '@vueuse/core'

export function useCategoryTabs() {
  const currentTab = useLocalStorage('category-tab', 0)

  const tabs = [
    {
      label: 'Costs',
      slot: 'cost',
    },
    {
      label: 'Incoming',
      slot: 'inc',
    },
  ]

  return { tabs, currentTab }
}
