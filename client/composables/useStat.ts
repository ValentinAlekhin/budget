import dayjs from 'dayjs'
import { uniq } from 'lodash-es'
import { useCategoryStore } from '~/store/category'
import { useRecordStore } from '~/store/record'

const createRecordMapper = (categories: any[]) => (records: any[]) =>
  records.map((r) => {
    const date = dayjs(r.timestamp)

    return {
      ...r,
      year: date.year(),
      month: date.month(),
      day: date.day(),
      category: categories.find((c) => c.id === r.categoryId),
    }
  })

export function useStat() {
  const { categoryStoreRefs } = useCategoryStore()
  const { recordStoreRefs } = useRecordStore()

  const mapper = createRecordMapper(categoryStoreRefs.data.value)

  const cost = computed(() => mapper(recordStoreRefs.costs.value))
  const inc = computed(() => mapper(recordStoreRefs.inc.value))
  const dist = computed(() => mapper(recordStoreRefs.dist.value))

  const records = computed(() => [...cost.value, ...inc.value, ...dist.value])

  const years = computed(() => uniq(records.value.map(({ year }) => year)))

  return { cost, inc, dist, records, years }
}
