import { ComputedRef } from 'vue'
import { Dayjs } from 'dayjs'
import { useLocalStorage } from '@vueuse/core'
import { useTimestamp } from '~/composables/useTimestamp'
export interface Range {
  name: string
  start: Dayjs
  end: Dayjs
}

export function useCommonRanges(name: string) {
  const {
    startOfCurrentMonth,
    startOfCurrentDay,
    endOfCurrentMonth,
    endOfCurrentDay,
    endOfCurrentYear,
    startOfCurrentYear,
  } = useTimestamp()

  const rangeValues: ComputedRef<Range[]> = computed(() => [
    {
      name: 'Current day',
      start: startOfCurrentDay.value,
      end: endOfCurrentDay.value,
    },
    {
      name: 'Current month',
      start: startOfCurrentMonth.value,
      end: endOfCurrentMonth.value,
    },
    {
      name: 'Last 30 days',
      start: endOfCurrentDay.value.subtract(30, 'day'),
      end: endOfCurrentDay.value,
    },
    {
      name: 'Current year',
      start: startOfCurrentYear.value,
      end: endOfCurrentYear.value,
    },
  ])

  const currentRangeIndex = useLocalStorage<number>(name, 0)
  const currentRange = computed(() =>
    rangeValues.value.find((_, i) => i === currentRangeIndex.value)
  )

  const handleClick = () => {
    const currentIndex = rangeValues.value.findIndex(
      (item) => item.name === currentRange.value?.name
    )
    const lastIndex = rangeValues.value.length - 1
    currentRangeIndex.value = currentIndex === lastIndex ? 0 : currentIndex + 1
  }

  return { rangeValues, currentRangeIndex, currentRange, handleClick }
}
