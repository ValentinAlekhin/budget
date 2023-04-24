<template>
  <div class="stat">
    <ClientOnly fallback-tag="span">
      <template v-if="isLargeScreen">
        <a-select
          v-model:value="year"
          :options="yearsOptions"
          style="width: 100px"
        />
        <highchart :options="costOptions" />
        <highchart :options="testOpt" />
      </template>

      <span v-else class="center">
        Статистика доступна только с экрана компьютера
      </span>

      <template #fallback>
        <a-spin class="center" size="large" />
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { Options } from "highcharts";
import { storeToRefs } from "pinia";
import dayjs from "dayjs";
import { sumBy } from "lodash";
import { useRouteQuery } from "@vueuse/router";
import { useCategoryStore } from "~/store/category";
import { useStat } from "~/hooks/useStat";

const isLargeScreen = useMediaQuery("(min-width: 1024px)");

const categoryStore = useCategoryStore();
const { costs: categories } = storeToRefs(categoryStore);

const { years, cost, inc } = useStat();

const yearsOptions = computed(() =>
  years.value.map((year) => ({ label: year, value: year }))
);

const year = useRouteQuery("year", dayjs().year().toString(), {
  transform: Number,
});

const recordsCostByYear = computed(() =>
  cost.value.filter((r) => r.year === year.value)
);

const recordsIncByYear = computed(() =>
  inc.value.filter((r) => r.year === year.value)
);

const availableMonth = Array(12)
  .fill("")
  .map((_, i) => i);

const series = computed(() =>
  Object.entries(
    categories.value.reduce((acc, { id, name }) => {
      acc[name] = availableMonth.map(
        (month) =>
          sumBy(
            recordsCostByYear.value.filter(
              (r) => r.month === month && r.category?.id === id
            ),
            "amount"
          ) || null
      );

      return acc;
    }, {})
  ).map(([name, data]) => ({ name, data }))
);

const testSeries = computed(() => {
  const stat = [
    { name: "Доходы", data: recordsIncByYear, color: "#389e0d" },
    { name: "Расходы", data: recordsCostByYear, color: "#d4380d" },
  ].map(({ name, data, color }) => {
    const newData = availableMonth.map(
      (month) =>
        sumBy(
          data.value.filter((r) => r.month === month),
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
      data: availableMonth.map(
        (month) =>
          (incStat.data[month] || 0) - (costStat.data[month] || 0) || null
      ),
    },
  ];
});

const testOpt = computed(() => ({
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
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
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

  series: testSeries.value,
}));

const costOptions = computed(
  (): Options => ({
    chart: {
      type: "area",
    },
    plotOptions: {
      series: {
        pointStart: 1,
      },
      area: {
        stacking: "percent",
        marker: {
          enabled: false,
        },
      },
    },
    accessibility: {
      point: {
        valueDescriptionFormat:
          "{index}. {point.category}, {point.y:,.1f} тыс. рублей, {point.percentage:.1f}%.",
      },
    },
    xAxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      accessibility: {
        description: "Months of the year",
      },
    },
    yAxis: {
      labels: {
        format: "{value}%",
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
      text: "Статистика по всем категориям",
    },
    series: series.value,
  })
);
</script>

<style lang="scss" scoped>
.center {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
