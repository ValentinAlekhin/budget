<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <p class="mb-2 text-sm text-cyan-500 font-medium" @click="handleClick">
        {{ currentRange?.name }}
      </p>
      <USelectMenu v-model="selected" class="w-36" :options="categoryTypes">
        <template #label>
          {{ selected.label }}
        </template>
      </USelectMenu>
    </div>

    <UCard class="mb-4" :ui="cardUi">
      <div class="flex justify-between items-center">
        <span class="font-bold text-gray-900 dark:text-white"> Total sum </span>
        <span class="text-xl font-bold text-gray-900 dark:text-white">
          {{ totalSum }}
        </span>
      </div>
    </UCard>

    <div>
      <UCard v-for="item of list" :key="item.id" class="mb-2" :ui="cardUi">
        <div class="grid grid-cols-5">
          <span class="text-sm text-gray-500 dark:text-gray-400 col-span-3">
            {{ item.name }}
          </span>

          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ item.percentage }}%
          </span>

          <span class="font-bold text-gray-900 dark:text-white text-end">
            {{ numberWithSpaces(item.sum) }}
          </span>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Dayjs } from "dayjs";
import { sumBy } from "lodash-es";
import { RecordDto } from "../../../common/dto/record";
import { useCommonRanges } from "~/composables/useCommonRanges";
import { useCategoryStore } from "~/store/category";
import { useRecordStore } from "~/store/record";
import { useRecord } from "~/composables/useRecord";

const categoryStore = useCategoryStore();
const { costs, incoming } = storeToRefs(categoryStore);
const recordStore = useRecordStore();
const recordsRefs = storeToRefs(recordStore);
const { filterRecordsByRange } = useRecord();
const { handleClick, currentRange } = useCommonRanges("stat-range-index");

const categoryTypes = computed(() =>
  [
    {
      label: "Costs",
      categories: costs.value,
      records: recordsRefs.costs.value,
    },
    {
      label: "Incoming",
      categories: incoming.value,
      records: recordsRefs.inc.value,
    },
  ].map((t, id) => ({ ...t, id }))
);
const selected = ref(categoryTypes.value[0]);

const filteredRecords = computed(() =>
  filterRecordsByRange(
    selected.value.records as RecordDto[],
    currentRange.value?.start as Dayjs,
    currentRange.value?.end as Dayjs
  )
);

const totalSum = computed(() => sumBy(filteredRecords.value, "amount"));

const getSum = (id: string, list: RecordDto[]) =>
  sumBy(
    list.filter((r) => r.categoryId === id),
    "amount"
  );

const list = computed(() =>
  selected.value.categories.map((c) => {
    const sum = getSum(c.id, filteredRecords.value);
    const percentage =
      Math.round((sum / totalSum.value) * 100 * 100) / 100 || 0;

    return {
      name: c.name,
      id: c.id,
      sum,
      percentage,
    };
  })
);

const cardUi = {
  body: {
    base: "",
    background: "",
    padding: "px-6 py-3 sm:p-6",
  },
};
</script>
