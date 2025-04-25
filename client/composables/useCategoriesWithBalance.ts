import { sumBy } from 'lodash-es'

// export interface CategoryWithBalance extends CategoryResponseDto {
//   formattedBalance: string
//   balance: number
//   colorClass: string
// }

export const useCategoriesWithBalance = createSharedComposable(() => {
  const {
    categoryStoreRefs: { costs: categoryCosts },
  } = useCategoryStore()
  const {
    recordStoreRefs: { costs },
  } = useRecordStore()
  const { now } = useTimestamp()
  const { filterRecordsByRange } = useRecord()

  const categoriesWithBalance = computed<CategoryWithBalance[]>(() =>
    categoryCosts.value.map((c) => {
      if (!c.plan)
        return { ...c, formattedBalance: '', balance: 0, colorClass: '' }

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
