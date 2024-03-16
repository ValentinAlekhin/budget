import { storeToRefs } from 'pinia'
import { sumBy } from 'lodash-es'
import { useCategoryStore } from '~/store/category'
import { useRecordStore } from '~/store/record'

export const useCategoriesWithBalance = createSharedComposable(function () {
  const categoryStore = useCategoryStore()
  const {
    recordStoreRefs: { costs },
  } = useRecordStore()
  const { now } = useTimestamp()
  const { filterRecordsByRange } = useRecord()
  const { costs: categoryCosts, incoming: categoryIncoming } =
    storeToRefs(categoryStore)

  const categoriesWithBalance = computed(() =>
    categoryCosts.value.map((c) => {
      if (!c.plan) return c

      const start = now.value.startOf(c.planPeriod)
      const end = now.value.endOf(c.planPeriod)
      const allCostList = costs.value.filter((r) => r.categoryId === c.id)
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
