<template>
  <a-table
    :columns="columns"
    :data-source="data"
    :pagination="pagination"
    size="small"
  >
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'category'">
        <nuxt-link v-if="record.to" :to="record.to">
          {{ text }}
        </nuxt-link>

        <span v-else>{{ text }}</span>
      </template>

      <span v-else-if="column.dataIndex === 'percent'">{{
        text ? `${text}%` : ""
      }}</span>

      <span v-else>{{ text === null ? "" : numberWithSpaces(text) }}</span>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import { TableColumnsType } from "ant-design-vue";
import { storeToRefs } from "pinia";
import { round, sum, sumBy } from "lodash";
import dayjs from "dayjs";
import { useRouteQuery } from "@vueuse/router";
import { AVAILABLE_MONTH, MONTH_LIST_RU } from "~/constants";
import { useCategoryStore } from "~/store/category";
import { median, numberWithSpaces } from "~/utils";
const categoryStore = useCategoryStore();

const { costs: categories } = storeToRefs(categoryStore);

const year = useRouteQuery("year", dayjs().year().toString(), {
  transform: Number,
});

const props = defineProps(["records"]);

const pagination = computed(() => ({
  pageSize: categories.value.length + 1,
  disabled: true,
}));

const columns: TableColumnsType = [
  {
    title: "Категория",
    dataIndex: "category",
    key: "category",
    width: 200,
  },
  ...MONTH_LIST_RU.map((title, i) => ({
    title,
    key: `${i}`,
    dataIndex: `${i}`,
  })),
  {
    title: "Среднее",
    key: "average",
    dataIndex: "average",
  },
  {
    title: "Медианное",
    key: "median",
    dataIndex: "median",
  },
  // {
  //   title: "Модальное",
  //   key: "modal",
  //   dataIndex: "modal",
  // },
  {
    title: "Сумма",
    key: "sum",
    dataIndex: "sum",
  },
  {
    title: "Процент",
    key: "percent",
    dataIndex: "percent",
  },
];

const getNumbers = (obj: Record<string, string | number>): number[] => {
  return Object.entries(obj)
    .filter(([key]) => AVAILABLE_MONTH.includes(+key))
    .map(([_, value]) => value)
    .filter((value) => value) as number[];
};

const getMedian = (obj: Record<string, string | number>): number | null => {
  const numbers = getNumbers(obj);

  const res = median(numbers);
  return Number.isNaN(res) ? null : round(res);
};

const getAverage = (obj: Record<string, string | number>) => {
  const numbers = getNumbers(obj);

  return round(obj.sum / numbers.length) || null;
};

const data = computed(() => {
  const mainData = categories.value.map((c) => {
    const sumByMonth = AVAILABLE_MONTH.map(
      (month) =>
        sumBy(
          props.records.filter(
            (r) => r.month === month && r.category?.id === c.id
          ),
          "amount"
        ) || null
    );

    const preparedSumByMonth = sumByMonth.reduce((acc, sum, i) => {
      acc[i] = sum || null;

      return acc;
    }, {});

    const sumByYear = sum(sumByMonth);

    return {
      to: `/stat/category/${c.id}?year=${year.value}`,
      category: c.name,
      ...preparedSumByMonth,
      sum: sumByYear || null,
    };
  });

  const totalSumByCategories = columns.reduce<Record<string, any>>(
    (acc, col) => {
      acc[col.key] =
        col.key === "category" ? "Всего" : sumBy(mainData, col.key) || null;

      return acc;
    },
    {}
  );

  const mainDataWithPercent = mainData.map((item, i) => ({
    ...item,
    percent: item.sum
      ? round((item.sum / totalSumByCategories.sum) * 100, 2)
      : null,
    average: getAverage(item),
    median: getMedian(item),
    modal: 0,
  }));

  return [
    ...mainDataWithPercent,
    {
      ...totalSumByCategories,
      average: getAverage(totalSumByCategories),
      median: getMedian(totalSumByCategories),
    },
  ];
});
</script>
