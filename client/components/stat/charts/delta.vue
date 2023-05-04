<template>
  <highchart :options="options" />
</template>

<script lang="ts" setup>
import { sumBy } from "lodash";
import { AVAILABLE_MONTH, MONTH_LIST_RU } from "~/constants";

const props = defineProps(["inc", "cost"]);

const series = computed(() => {
  const stat = [
    { name: "Доходы", data: props.inc, color: "#389e0d" },
    { name: "Расходы", data: props.cost, color: "#d4380d" },
  ].map(({ name, data, color }) => {
    const newData = AVAILABLE_MONTH.map(
      (month) =>
        sumBy(
          data.filter((r) => r.month === month),
          "amount"
        ) || null
    );
    return { color, name, data: newData };
  });

  const [incStat, costStat] = stat;

  return [
    ...stat,
    {
      name: "Дельта",
      color: "#1d39c4",
      data: AVAILABLE_MONTH.map(
        (month) =>
          (incStat.data[month] || 0) - (costStat.data[month] || 0) || null
      ),
    },
  ];
});

const options = computed(() => ({
  chart: {
    type: "spline",
  },
  title: {
    text: "Соотношение доходов к расходам",
  },

  yAxis: {
    title: {
      text: "Сумма",
    },
  },

  xAxis: {
    categories: MONTH_LIST_RU,
    accessibility: {
      rangeDescription: "Месяца",
    },
  },

  tooltip: {
    crosshairs: true,
    shared: true,
  },

  plotOptions: {
    series: {
      pointStart: 1,
    },
  },

  series: series.value,
}));
</script>
