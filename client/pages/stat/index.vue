<template>
  <div>
    <UTabs :items="tabs" v-model:model-value="currentTab" class="w-full" />
    <UTabs
      :items="ranges"
      v-model:model-value="currentRangeIndex"
      class="w-full"
    />

    <div class="mb-2 flex items-center justify-between">
      <UButton
        icon="i-heroicons-chevron-left"
        :padded="false"
        color="gray"
        variant="link"
        size="xl"
        @click="prevDate"
      />
      <span class="font-semibold">
        {{ currentRange.rangeView(startEndDates) }}
      </span>
      <UButton
        icon="i-heroicons-chevron-right"
        :padded="false"
        color="gray"
        variant="link"
        size="xl"
        @click="nextDate"
      />
    </div>

    <UCard class="mb-4" :ui="cardUi">
      <div class="flex items-center justify-between">
        <span class="font-bold text-gray-900 dark:text-white">
          {{ t('common.totalSum') }}
        </span>
        <span class="text-xl font-bold text-gray-900 dark:text-white">
          {{ numberWithSpaces(totalSum) }}
        </span>
      </div>
    </UCard>

    <div v-auto-animate>
      <template v-if="list.length">
        <UCard v-for="item of list" :key="item.id" class="mb-2" :ui="cardUi">
          <div class="grid grid-cols-6 items-center">
            <span class="col-span-3 text-sm text-gray-500 dark:text-gray-400">
              {{ item.name }}
            </span>

            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ item.percentage }}%
            </span>

            <span
              class="col-span-2 text-end font-bold text-gray-900 dark:text-white"
            >
              {{ numberWithSpaces(item.sum) }}
            </span>
          </div>
        </UCard>
      </template>

      <div v-else class="mt-10 flex items-center justify-center">
        <Icon name="carbon:db2-database" size="24" class="mr-2" />

        <span
          class="text-center text-lg font-semibold text-gray-900 dark:text-white"
        >
          {{ t('common.noRecords') }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Dayjs, ManipulateType } from 'dayjs'
import { capitalize, sumBy } from 'lodash-es'
import type { RecordDto } from '../../../common/dto/record'
import { useCategoryStore } from '~/store/category'
import { useRecordStore } from '~/store/record'
import { useRecord } from '~/composables/useRecord'
import { useCategoryTabs } from '~/composables/useCategoryTabs'
import { useLocalStorage } from '@vueuse/core/index'

const categoryStore = useCategoryStore()
const { costs, incoming } = storeToRefs(categoryStore)
const recordStore = useRecordStore()
const recordsRefs = storeToRefs(recordStore)
const { filterRecordsByRange } = useRecord()
const { t } = useI18n()
const { currentTab, tabs } = useCategoryTabs()
const {
  startOfCurrentDay,
  endOfCurrentDay,
  startOfCurrentYear,
  endOfCurrentYear,
  startOfCurrentMonth,
  endOfCurrentMonth,
  startOfCurrentWeek,
  endOfCurrentWeek,
  startOfCurrentQuarter,
  endOfCurrentQuarter,
} = useTimestamp()

const startEndDates = ref({
  start: startOfCurrentDay.value,
  end: endOfCurrentDay.value,
})

const categoryTypes = computed(() => [
  {
    categories: costs.value,
    records: recordsRefs.costs.value,
  },
  {
    categories: incoming.value,
    records: recordsRefs.inc.value,
  },
])
const selected = computed(() => categoryTypes.value[currentTab.value])

const currentRangeIndex = useLocalStorage('stat-range', 0)
const ranges = computed(() => [
  {
    label: capitalize(t('common.day')),
    start: startOfCurrentDay.value,
    end: endOfCurrentDay.value,
    step: 'day',
    rangeView: ({ start }: { start: Dayjs; end?: Dayjs }) =>
      start.format('D MMMM, YYYY'),
  },
  {
    label: capitalize(t('common.week')),
    start: startOfCurrentWeek.value,
    end: endOfCurrentWeek.value,
    step: 'week',
    rangeView: ({ start, end }: { start: Dayjs; end?: Dayjs }) =>
      `${start.format('D MMMM')} - ${end.format('D MMM, YYYY')}`,
  },
  {
    label: capitalize(t('common.month')),
    start: startOfCurrentMonth.value,
    end: endOfCurrentMonth.value,
    step: 'month',
    rangeView: ({ start }: { start: Dayjs; end?: Dayjs }) =>
      capitalize(`${start.format('MMMM, YYYY')}`),
  },
  {
    label: capitalize(t('common.quarter')),
    start: startOfCurrentQuarter.value,
    end: endOfCurrentQuarter.value,
    step: 'quarter',
    rangeView: ({ start }: { start: Dayjs; end?: Dayjs }) =>
      `${start.quarter()} ${t('common.quarter')}, ${start.format('YYYY')}`,
  },
  {
    label: capitalize(t('common.year')),
    start: startOfCurrentYear.value,
    end: endOfCurrentYear.value,
    step: 'year',
    rangeView: ({ start }: { start: Dayjs; end?: Dayjs }) =>
      start.format('YYYY'),
  },
])

const currentRange = computed(() => ranges.value[currentRangeIndex.value])

const filteredRecords = computed(() =>
  filterRecordsByRange(
    selected.value.records as RecordDto[],
    startEndDates.value.start as Dayjs,
    startEndDates.value.end as Dayjs,
  ),
)

const totalSum = computed(() => sumBy(filteredRecords.value, 'amount'))

const getSum = (id: string, list: RecordDto[]) =>
  sumBy(
    list.filter((r) => r.categoryId === id),
    'amount',
  )

const list = computed(() =>
  selected.value.categories
    .map((c) => {
      const sum = getSum(c.id, filteredRecords.value)
      const percentage =
        Math.round((sum / totalSum.value) * 100 * 100) / 100 || 0

      return {
        name: c.name,
        id: c.id,
        sum,
        percentage,
      }
    })
    .filter((c) => c.sum),
)

const cardUi = {
  body: {
    padding: 'px-6 py-3 sm:p-6',
  },
}

const prevDate = () => {
  const step = currentRange.value.step as ManipulateType

  startEndDates.value = {
    start: startEndDates.value.start.subtract(1, step),
    end: startEndDates.value.end.subtract(1, step),
  }
}
const nextDate = () => {
  const step = currentRange.value.step as ManipulateType

  startEndDates.value = {
    start: startEndDates.value.start.add(1, step),
    end: startEndDates.value.end.add(1, step),
  }
}

onMounted(() => {
  startEndDates.value = {
    start: currentRange.value.start,
    end: currentRange.value.end,
  }
})

watch(currentRange, (value: any) => {
  startEndDates.value = {
    start: value?.start,
    end: value?.end,
  }
})
</script>
