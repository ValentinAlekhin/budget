import { useCategoryStore } from '~/store/category'
import { storeToRefs } from 'pinia'
import { sumBy } from 'lodash-es'

export function usePlan() {
  const categoryStore = useCategoryStore()
  const { costs, incoming, data } = storeToRefs(categoryStore)

  const costsPlan = computed(() => sumBy(costs.value, 'plan'))
  const incomingPlan = computed(() => sumBy(incoming.value, 'plan'))
  const planExists = computed(() => costsPlan.value || incomingPlan.value)
  const planDelta = computed(() => incomingPlan.value - costsPlan.value)

  const categoryHavePlan = (id: string): boolean =>
    !!data.value.find((c) => c.id === id)?.plan

  const isValidCostPlan = (value: any): boolean => {
    if (!value) return true

    return false
  }

  return { costsPlan, incomingPlan, planExists, planDelta, categoryHavePlan }
}
