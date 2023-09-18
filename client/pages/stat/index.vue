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

    <div>
      <UCard v-for="item of list" :key="item.id" class="mb-2" :ui="cardUi">
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ item.name }}
          </span>
          <span class="font-bold text-gray-900 dark:text-white">
            {{ item.sum }}
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
    { label: "Costs", list: costs.value },
    { label: "Incoming", list: incoming.value },
  ].map((t, id) => ({ ...t, id }))
);
const selected = ref(categoryTypes.value[0]);

const filteredRecords = computed(() =>
  filterRecordsByRange(
    [...recordsRefs.costs.value, ...recordsRefs.inc.value],
    currentRange.value?.start as Dayjs,
    currentRange.value?.end as Dayjs
  )
);

const getSum = (id: string, list: RecordDto[]) =>
  numberWithSpaces(
    sumBy(
      list.filter((r) => r.categoryId === id),
      "amount"
    )
  );

const list = computed(() =>
  selected.value.list.map((c) => ({
    name: c.name,
    id: c.id,
    sum: getSum(c.id, filteredRecords.value),
  }))
);

const cardUi = {
  body: {
    base: "",
    background: "",
    padding: "px-6 py-3 sm:p-6",
  },
};
</script>
