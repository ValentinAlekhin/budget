<script lang="ts" setup>
import { useRouteQuery } from '@vueuse/router'
import dayjs from 'dayjs'
import { round, sum, sumBy } from 'lodash-es'
import { storeToRefs } from 'pinia'

const props = defineProps(['records'])

const categoryStore = useCategoryStore()

const { costs: categories } = storeToRefs(categoryStore.categoryStore)

const year = useRouteQuery('year', dayjs().year().toString(), {
  transform: Number,
})

const columns = [
  {
    label: 'Категория',
    key: 'category',
    width: 200,
  },
  ...MONTH_LIST_RU.map((label, i) => ({
    label,
    key: `${i}`,
  })),
  {
    label: 'Среднее',
    key: 'average',
  },
  {
    label: 'Медианное',
    key: 'median',
  },
  // {
  //   label: "Модальное",
  //   key: "modal",
  //   key: "modal",
  // },
  {
    label: 'Сумма',
    key: 'sum',
  },
  {
    label: 'Процент',
    key: 'percent',
  },
]

function getNumbers(obj: Record<string, string | number>): number[] {
  return Object.entries(obj)
    .filter(([key]) => AVAILABLE_MONTH.includes(+key))
    .map(([_, value]) => value)
    .filter(value => value) as number[]
}

function getMedian(obj: Record<string, string | number>): number | null {
  const numbers = getNumbers(obj)

  const res = median(numbers)
  return Number.isNaN(res) ? null : round(res)
}

function getAverage(obj: Record<string, string | number>) {
  const numbers = getNumbers(obj)

  return round(obj.sum / numbers.length) || null
}

const data = computed(() => {
  const mainData = categories.value.map((c) => {
    const sumByMonth = AVAILABLE_MONTH.map(
      month =>
        sumBy(
          props.records.filter(
            r => r.month === month && r.category?.id === c.id,
          ),
          'amount',
        ) || null,
    )

    const preparedSumByMonth = sumByMonth.reduce((acc, sum, i) => {
      acc[i] = sum || null

      return acc
    }, {})

    const sumByYear = sum(sumByMonth)

    return {
      to: `/stat/category/${c.id}?year=${year.value}`,
      category: c.name,
      ...preparedSumByMonth,
      sum: sumByYear || null,
    }
  })

  const totalSumByCategories = columns.reduce<Record<string, any>>(
    (acc, col) => {
      acc[col.key]
        = col.key === 'category' ? 'Всего' : sumBy(mainData, col.key) || null

      return acc
    },
    {},
  )

  const mainDataWithPercent = mainData.map((item, i) => ({
    ...item,
    percent: item.sum
      ? round((item.sum / totalSumByCategories.sum) * 100, 2)
      : null,
    average: getAverage(item),
    median: getMedian(item),
    modal: 0,
  }))

  return [
    ...mainDataWithPercent,
    {
      ...totalSumByCategories,
      average: getAverage(totalSumByCategories),
      median: getMedian(totalSumByCategories),
    },
  ]
})
</script>

<template>
  <UTable :columns="columns" :rows="data">
    <template #category-data="{ row }">
      <ULink
        v-if="row.to"
        class="font-medium text-cyan-500 underline"
        :to="row.to"
      >
        {{ row.category }}
      </ULink>

      <span v-else>{{ row.category }}</span>
    </template>

    <template #percent-data="{ row }">
      <span>{{ row.percent ? `${row.percent}%` : "" }}</span>
    </template>
  </UTable>
</template>
