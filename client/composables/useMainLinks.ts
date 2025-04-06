export function useMainLinks() {
  const { t } = useI18n()

  const links = computed(() => [
    { label: t('common.home'), icon: 'i-heroicons-banknotes', to: '/' },
    { label: t('common.records'), icon: 'i-heroicons-circle-stack', to: '/records' },
    {
      label: t('common.reports'),
      icon: 'i-heroicons-presentation-chart-line',
      to: '/reports',
    },
  ])

  return { links }
}
