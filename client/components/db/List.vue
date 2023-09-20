<template>
  <ul
    class="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700"
  >
    <li
      v-for="row of props.rows"
      :key="row.id"
      class="flex items-center justify-between p-1 sm:b-2 px-3 sm:px-4 mb-2 sm:mb-3"
    >
      <div class="flex flex-col justify-between">
        <div class="grid grid-cols-12 items-center mb-2 w-72">
          <span
            class="col-span-1 flex w-3 h-3 rounded-full mr-2"
            :class="getTypeBackgroundClasses(row.type)"
          />

          <span
            class="col-span-6 w-32 text-sm font-medium text-gray-900 dark:text-white truncate"
          >
            {{ getCategoryName(row.categoryId) }}
          </span>

          <span
            class="col-span-4 text-sm text-gray-500 dark:text-gray-400 text-left"
          >
            {{ dayjs(row.timestamp).format("DD.MM.YYYY") }}
          </span>
        </div>

        <p class="pl-6 pr-2 text-sm text-gray-500 dark:text-gray-400">
          {{ row.comment }}
        </p>
      </div>
      <div class="flex flex-col items-end justify-end">
        <span class="text-base font-semibold text-gray-900 dark:text-white">
          {{ numberWithSpaces(row.amount) }}
        </span>
        <DbActionsDropdown
          :record="row"
          @edit="emit('edit', $event)"
          @delete="emit('delete', $event)"
        />
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
import { useCategory } from "~/composables/useCategory";
import { useRecord } from "~/composables/useRecord";

const props = defineProps<{ rows: any[] }>();
const emit = defineEmits(["edit", "delete"]);

const { getCategoryName } = useCategory();
const { getTypeBackgroundClasses } = useRecord();
</script>
