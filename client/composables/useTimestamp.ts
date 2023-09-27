import dayjs from 'dayjs'
import { useIntervalFn } from '@vueuse/core'
export function useTimestamp() {
  const now = ref(dayjs())

  useIntervalFn(() => (now.value = dayjs()), 1000 * 60 * 10)

  const startOfCurrentDay = computed(() =>
    now.value.hour(0).minute(0).second(0).millisecond(0)
  )
  const startOfCurrentMonth = computed(() => startOfCurrentDay.value.date(1))

  const endOfCurrentDay = computed(() => startOfCurrentDay.value.add(1, 'day'))
  const endOfCurrentMonth = computed(() =>
    startOfCurrentMonth.value.add(1, 'month')
  )
  const startOfCurrentYear = computed(() => startOfCurrentMonth.value.month(0))
  const endOfCurrentYear = computed(() =>
    startOfCurrentYear.value.add(1, 'year')
  )

  return {
    now,
    startOfCurrentDay,
    startOfCurrentMonth,
    endOfCurrentDay,
    endOfCurrentMonth,
    startOfCurrentYear,
    endOfCurrentYear,
  }
}
