import { storeToRefs } from 'pinia'
import { sumBy } from 'lodash-es'
import { useCategoryStore } from '~/store/category'
import { useRecordStore } from '~/store/record'

export function useCategoriesWithBalance() {
  const categoryStore = useCategoryStore()
  const recordStore = useRecordStore()
  const { startOfCurrentMonth, endOfCurrentMonth } = useTimestamp()
  const { filterRecordsByRange } = useRecord()
  const { costs: categoryCosts } = storeToRefs(categoryStore)
  const { costs } = storeToRefs(recordStore)

  const categoriesWithBalance = computed(() =>
    categoryCosts.value.map((c) => {
      if (!c.plan) return c

      const allCostList = costs.value.filter((r) => r.categoryId === c.id)
      const rangedCostList = filterRecordsByRange(
        allCostList,
        startOfCurrentMonth.value,
        endOfCurrentMonth.value
      )
      const allCostSum = sumBy(rangedCostList, 'amount')

      const balance = c.plan - allCostSum
      const colorClass = balance < 0 ? 'text-rose-300' : ''

      return {
        ...c,
        formattedBalance: numberWithSpaces(balance),
        balance,
        colorClass,
      }
    })
  )

  return { categoriesWithBalance }
}
