import { useIntervalFn } from '@vueuse/core'
import dayjs from 'dayjs'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import 'dayjs/locale/ru'

dayjs.extend(weekOfYear)
dayjs.extend(quarterOfYear)

export function useTimestamp() {
  const { locale } = useI18n()
  dayjs.locale(locale.value)

  const now = ref(dayjs())

  useIntervalFn(() => (now.value = dayjs()), 1000 * 60 * 10)

  const startOfCurrentDay = computed(() => now.value.startOf('day'))
  const endOfCurrentDay = computed(() => now.value.endOf('day'))

  const startOfCurrentWeek = computed(() => now.value.startOf('week'))
  const endOfCurrentWeek = computed(() => now.value.endOf('week'))

  const startOfCurrentMonth = computed(() => now.value.startOf('month'))
  const endOfCurrentMonth = computed(() => now.value.endOf('month'))

  const startOfCurrentQuarter = computed(() => now.value.startOf('quarter'))
  const endOfCurrentQuarter = computed(() => now.value.endOf('quarter'))

  const startOfCurrentYear = computed(() => now.value.startOf('year'))
  const endOfCurrentYear = computed(() => now.value.endOf('year'))

  watch(locale, value => dayjs.locale(value))

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
