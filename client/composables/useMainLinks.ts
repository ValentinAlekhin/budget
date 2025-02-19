export function useMainLinks() {
  const links = computed(() => [
    { label: 'Costs', icon: 'i-heroicons-banknotes', to: '/' },
    { label: 'Data', icon: 'i-heroicons-circle-stack', to: '/db' },
    {
      label: 'Statistic',
      icon: 'i-heroicons-presentation-chart-line',
      to: '/stat',
    },
  ])

  return { links }
}
