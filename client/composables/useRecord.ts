import type { Dayjs } from 'dayjs'
import type { UnwrapRef } from 'vue'
import dayjs from 'dayjs'
import { twMerge } from 'tailwind-merge'

export function useRecord() {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cost':
        return 'red'

      case 'dist':
        return 'cyan'

      case 'inc':
        return 'green'

      case 'adjustment':
        return 'yellow'
    }
  }

  const getTypeBackgroundClasses = (type: string) => {
    const color = getTypeColor(type)

    return twMerge(`bg-${color}-400`)
  }

  const filterRecordsByRange = (
    list: RecordResponseDto[] | UnwrapRef<RecordResponseDto>[],
    start: Dayjs,
    end: Dayjs,
  ) =>
    list.filter(({ timestamp }) => {
      const time = dayjs(timestamp)

      return time.isAfter(start) && time.isBefore(end)
    })

  return { getTypeColor, getTypeBackgroundClasses, filterRecordsByRange }
}
