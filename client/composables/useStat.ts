import dayjs from 'dayjs'
import { uniq } from 'lodash-es'

function createRecordMapper(categories: any[]) {
  return (records: any[]) =>
    records.map((r) => {
      const date = dayjs(r.timestamp)

      return {
        ...r,
        year: date.year(),
        month: date.month(),
        day: date.day(),
        category: categories.find(c => c.id === r.categoryId),
      }
    })
}

export function useStat() {
  const { categoryStoreRefs } = useCategoryStore()
  const { recordStoreRefs } = useRecordStore()

  const mapper = createRecordMapper(categoryStoreRefs.data.value)

  const cost = computed(() => mapper(recordStoreRefs.costs.value))
  const inc = computed(() => mapper(recordStoreRefs.inc.value))

  const records = computed(() => [...cost.value, ...inc.value])

  const years = computed(() => uniq(records.value.map(({ year }) => year)))

  return { cost, inc, records, years }
}
