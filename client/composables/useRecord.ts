import type { Dayjs } from 'dayjs'
import type { UnwrapRef } from 'vue'
import dayjs from 'dayjs'
import { get } from 'lodash-es'

const bgColorMap = {
  cost: 'bg-red-400',
  inc: 'bg-green-400',
  adjustment: 'bg-yellow-400',
}

const textColorMap = {
  cost: 'text-red-400',
  inc: 'text-green-400',
  adjustment: 'text-yellow-400',
}

export function useRecord() {
  const getTypeBackgroundClasses = (type: string) => get(bgColorMap, type, bgColorMap.cost)
  const getTypeTextClasses = (type: string) => get(textColorMap, type, textColorMap.cost)

  const filterRecordsByRange = (
    list: RecordResponseDto[] | UnwrapRef<RecordResponseDto>[],
    start: Dayjs,
    end: Dayjs,
  ) =>
    list.filter(({ timestamp }) => {
      const time = dayjs(timestamp)

      return time.isAfter(start) && time.isBefore(end)
    })

  return { getTypeBackgroundClasses, getTypeTextClasses, filterRecordsByRange }
}
