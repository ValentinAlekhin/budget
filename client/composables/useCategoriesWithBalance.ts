import { sumBy } from 'lodash-es'

export const useCategoriesWithBalance = createSharedComposable(() => {
  const {
    categoryStoreRefs: { costs: categoryCosts },
  } = useCategoryStore()
  const {
    recordStoreRefs: { costs },
  } = useRecordStore()
  const { now } = useTimestamp()
  const { filterRecordsByRange } = useRecord()

  const categoriesWithBalance = computed(() =>
    categoryCosts.value.map((c) => {
      if (!c.plan)
        return c

      const start = now.value.startOf(c.planPeriod)
      const end = now.value.endOf(c.planPeriod)
      const allCostList = costs.value.filter(r => r.categoryId === c.id)
      const rangedCostList = filterRecordsByRange(allCostList, start, end)
      const allCostSum = sumBy(rangedCostList, 'amount')

      const balance = c.plan - allCostSum
      const colorClass = balance < 0 ? 'text-rose-300' : ''

      return {
        ...c,
        formattedBalance: numberWithSpaces(balance),
        balance,
        colorClass,
      }
    }),
  )

  return { categoriesWithBalance }
})
