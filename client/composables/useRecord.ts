import type { Dayjs } from 'dayjs'
import type { UnwrapRef } from 'vue'
import dayjs from 'dayjs'

export function useRecord() {
  const getTypeBackgroundClasses = (type: string) => {
    switch (type) {
      case 'cost':
        return 'bg-red-400'

      case 'dist':
        return 'bg-cyan-400'

      case 'inc':
        return 'bg-green-400'

      case 'adjustment':
        return 'bg-yellow-400'
    }
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

  return { getTypeBackgroundClasses, filterRecordsByRange }
}
