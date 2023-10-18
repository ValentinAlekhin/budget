<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <p class="mb-2 text-sm font-medium text-cyan-500" @click="handleClick">
        {{ currentRange?.name }}
      </p>
      <USelectMenu v-model="selected" class="w-36" :options="categoryTypes">
        <template #label>
          {{ selected.label }}
        </template>
      </USelectMenu>
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
import { Dayjs } from 'dayjs'
import { sumBy } from 'lodash-es'
import { RecordDto } from '../../../common/dto/record'
import { useCommonRanges } from '~/composables/useCommonRanges'
import { useCategoryStore } from '~/store/category'
import { useRecordStore } from '~/store/record'
import { useRecord } from '~/composables/useRecord'

const categoryStore = useCategoryStore()
const { costs, incoming } = storeToRefs(categoryStore)
const recordStore = useRecordStore()
const recordsRefs = storeToRefs(recordStore)
const { filterRecordsByRange } = useRecord()
const { handleClick, currentRange } = useCommonRanges('stat-range-index')
const { t } = useI18n()

const categoryTypes = computed(() =>
  [
    {
      label: t('common.costs'),
      categories: costs.value,
      records: recordsRefs.costs.value,
    },
    {
      label: t('common.incoming'),
      categories: incoming.value,
      records: recordsRefs.inc.value,
    },
  ].map((t, id) => ({ ...t, id })),
)
const selected = ref(categoryTypes.value[0])

const filteredRecords = computed(() =>
  filterRecordsByRange(
    selected.value.records as RecordDto[],
    currentRange.value?.start as Dayjs,
    currentRange.value?.end as Dayjs,
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
</script>
