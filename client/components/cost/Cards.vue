<template>
  <UCard class="mb-4">
    <div class="flex flex-col mb-4">
      <span class="text-sm text-gray-700 dark:text-gray-400">
        Current balance
      </span>
      <span class="text-2xl font-bold">{{ currentBalance }}</span>
    </div>

    <div>
      <span class="text-sm text-gray-700 dark:text-gray-400 mb-1 block">
        Sum
      </span>
      <div class="grid grid-cols-2">
        <div class="flex flex-col">
          <span class="text-xs mb-0.5">
            <Icon
              name="ic:round-arrow-drop-up"
              class="scale-200 text-green-500"
            />
            Income
          </span>
          <span class="font-bold">+{{ totalIncoming }}</span>
        </div>

        <div class="flex flex-col">
          <span class="text-xs mb-0.5">
            <Icon
              name="ic:round-arrow-drop-down"
              class="scale-200 text-rose-500"
            />
            Costs
          </span>
          <span class="font-bold">-{{ totalCost }}</span>
        </div>
      </div>
    </div>
  </UCard>

  <p class="mb-2 text-sm text-cyan-500 font-medium" @click="handleClick">
    {{ currentRange.name }}
  </p>

  <div class="grid grid-cols-2 gap-2 mb-6">
    <UCard v-for="card of miniCards" :key="card.icon">
      <div class="flex items-center mb-4">
        <span
          class="rounded-full h-8 w-8 mr-2"
          :class="`bg-${card.color}-300/25`"
        >
          <Icon
            :name="card.icon"
            class="mt-[5px] ml-[8px]"
            :class="`text-${card.color}-500`"
          />
        </span>
        <div class="flex flex-col">
          <span class="text-xs text-gray-500 dark:text-gray-400">
            {{ card.name }}
          </span>
          <span class="font-bold text-gray-900 dark:text-white">
            {{ numberWithSpaces(card.value) }}
          </span>
        </div>
      </div>

      <div class="w-full h-0.5 rounded" :class="`bg-${card.color}-500`" />
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { sumBy } from "lodash-es";
import { Dayjs } from "dayjs";
import { useLocalStorage } from "@vueuse/core";
import { useTimestamp } from "~/hooks/useTimestamp";
import { useRecord } from "~/hooks/useRecord";
import { useRecordStore } from "~/store/record";
import { useCategoriesWithBalance } from "~/hooks/useCategoriesWithBalance";

interface Range {
  name: string;
  start: Dayjs;
  end: Dayjs;
}

const recordStore = useRecordStore();
const { costs, inc } = storeToRefs(recordStore);
const { categoriesWithBalance } = useCategoriesWithBalance();
const {
  startOfCurrentMonth,
  startOfCurrentDay,
  endOfCurrentMonth,
  endOfCurrentDay,
} = useTimestamp();
const { filterRecordsByRange } = useRecord();

const rangeValues: Range[] = [
  { name: "Current day", start: startOfCurrentDay, end: endOfCurrentDay },
  { name: "Current month", start: startOfCurrentMonth, end: endOfCurrentMonth },
  {
    name: "Last 30 days",
    start: endOfCurrentDay.subtract(30, "day"),
    end: endOfCurrentDay,
  },
];

const currentRange = useLocalStorage<Range>("home-range", rangeValues[0]);

const handleClick = () => {
  const currentIndex = rangeValues.findIndex(
    (item) => item.name === currentRange.value.name
  );
  const lastIndex = rangeValues.length - 1;
  const newIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;

  currentRange.value = rangeValues[newIndex];
};

const currentBalance = computed(() =>
  numberWithSpaces(sumBy(categoriesWithBalance.value, "balance"))
);

const totalIncoming = computed(() =>
  numberWithSpaces(sumBy(inc.value, "amount"))
);
const totalCost = computed(() =>
  numberWithSpaces(sumBy(costs.value, "amount"))
);

const miniCards = computed(() =>
  [
    { color: "green", icon: "bi:arrow-up-right", list: inc, name: "Income" },
    { color: "red", icon: "bi:arrow-down-right", list: costs, name: "Cost" },
  ].map((item) => ({
    ...item,
    value: sumBy(
      filterRecordsByRange(
        item.list.value,
        currentRange.value.start as Dayjs,
        currentRange.value.end as Dayjs
      ),
      "amount"
    ),
  }))
);
</script>
