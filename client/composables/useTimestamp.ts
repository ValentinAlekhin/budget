import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import { useIntervalFn } from '@vueuse/core'

dayjs.extend(weekOfYear)
dayjs.extend(quarterOfYear)

export function useTimestamp() {
  const now = ref(dayjs())

  useIntervalFn(() => (now.value = dayjs()), 1000 * 60 * 10)

  const startOfCurrentDay = computed(() =>
    now.value.hour(0).minute(0).second(0).millisecond(0),
  )
  const endOfCurrentDay = computed(() => startOfCurrentDay.value.add(1, 'day'))

  const currentWeekNumber = computed(() => startOfCurrentDay.value.week())
  const startOfCurrentWeek = computed(() =>
    startOfCurrentDay.value.week(currentWeekNumber.value),
  )
  const endOfCurrentWeek = computed(() =>
    startOfCurrentWeek.value.add(1, 'week'),
  )

  const startOfCurrentMonth = computed(() => startOfCurrentDay.value.date(1))
  const endOfCurrentMonth = computed(() =>
    startOfCurrentMonth.value.add(1, 'month'),
  )

  const startOfCurrentQuarter = computed(() =>
    startOfCurrentDay.value.quarter(1),
  )
  const endOfCurrentQuarter = computed(() =>
    startOfCurrentQuarter.value.add(1, 'quarter'),
  )

  const startOfCurrentYear = computed(() => startOfCurrentMonth.value.month(0))
  const endOfCurrentYear = computed(() =>
    startOfCurrentYear.value.add(1, 'year'),
  )

  return {
    now,
    startOfCurrentDay,
    startOfCurrentWeek,
    endOfCurrentWeek,
    startOfCurrentMonth,
    endOfCurrentDay,
    endOfCurrentMonth,
    startOfCurrentQuarter,
    endOfCurrentQuarter,
    startOfCurrentYear,
    endOfCurrentYear,
  }
}
