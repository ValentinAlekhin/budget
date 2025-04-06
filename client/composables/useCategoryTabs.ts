import { useLocalStorage } from '@vueuse/core'

export function useCategoryTabs() {
  const { t } = useI18n()
  const currentTab = useLocalStorage('category-tab', '0')

  const tabs = computed(() => [
    {
      label: t('common.costs'),
      slot: 'cost',
    },
    {
      label: t('common.incoming'),
      slot: 'inc',
    },
  ])

  const currentTabName = computed(() => tabs.value[Number.parseInt(currentTab.value)].slot)

  return { tabs, currentTab, currentTabName }
}
