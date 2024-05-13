<template>
  <highchart :options="options" />
</template>

<script lang="ts" setup>
import { Options } from 'highcharts'
import { storeToRefs } from 'pinia'
import { sumBy } from 'lodash-es'
import { AVAILABLE_MONTH, MONTH_LIST_RU } from '~/shared'
import { useCategoryStore } from '~/store/category'
const categoryStore = useCategoryStore()

const { costs: categories } = storeToRefs(categoryStore)
const props = defineProps(['records'])

const series = computed(() =>
  Object.entries(
    categories.value.reduce((acc, { id, name }) => {
      acc[name] = AVAILABLE_MONTH.map(
        (month) =>
          sumBy(
            props.records.filter(
              (r) => r.month === month && r.category?.id === id,
            ),
            'amount',
          ) || null,
      )

      return acc
    }, {}),
  ).map(([name, data]) => ({ name, data })),
)

const options = computed(
  (): Options => ({
    chart: {
      type: 'area',
      backgroundColor: 'rgba(0,0,0,0)',
    },
    plotOptions: {
      series: {
        pointStart: 1,
      },
      area: {
        stacking: 'percent',
        marker: {
          enabled: false,
        },
      },
    },
    accessibility: {
      point: {
        valueDescriptionFormat:
          '{index}. {point.category}, {point.y:,.1f} тыс. рублей, {point.percentage:.1f}%.',
      },
    },
    xAxis: {
      categories: MONTH_LIST_RU,
      accessibility: {
        description: 'Months of the year',
      },
    },
    yAxis: {
      labels: {
        format: '{value}%',
      },
      title: {
        enabled: false,
      },
    },
    tooltip: {
      pointFormat:
        '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.1f} руб)<br/>',
      split: true,
    },
    title: {
      text: 'Статистика по всем категориям',
    },
    series: series.value,
    legend: {
      itemStyle: {
        color: '#fff',
      },
    },
  }),
)
</script>
