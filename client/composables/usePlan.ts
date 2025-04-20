import { sumBy } from 'lodash-es'

export function usePlan() {
  const { categoryStoreRefs: { costs, incoming, data } } = useCategoryStore()

  const costsPlan = computed(() => sumBy(costs.value, 'plan'))
  const incomingPlan = computed(() => sumBy(incoming.value, 'plan'))
  const planExists = computed(() => costsPlan.value || incomingPlan.value)
  const planDelta = computed(() => incomingPlan.value - costsPlan.value)

  const categoryHavePlan = (id: number): boolean =>
    !!data.value.find(c => c.id === id)?.plan

  const isValidCostPlan = (value: any): boolean => {
    return !value
  }

  return { costsPlan, incomingPlan, planExists, planDelta, categoryHavePlan, isValidCostPlan }
}
