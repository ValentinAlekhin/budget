<template>
  <ul
    class="divide-y divide-gray-200 text-gray-900 dark:divide-gray-700 dark:text-white"
  >
    <li
      v-for="row of props.rows"
      :key="row.id"
      class="sm:b-2 mb-2 flex items-start justify-between p-1 px-3 sm:mb-3 sm:px-4"
    >
      <div class="mt-1 flex flex-col justify-between">
        <div class="mb-2 grid w-72 grid-cols-12 items-center">
          <span
            class="col-span-1 mr-2 flex h-3 w-3 rounded-full"
            :class="getTypeBackgroundClasses(row.type)"
          />

          <span
            class="col-span-6 w-32 truncate text-sm font-medium text-gray-900 dark:text-white"
          >
            {{ getCategoryName(row.categoryId) }}
          </span>

          <span
            class="col-span-4 text-left text-sm text-gray-500 dark:text-gray-400"
          >
            {{ dayjs(row.timestamp).format('DD.MM.YYYY') }}
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
import dayjs from 'dayjs'
import { useCategory } from '~/composables/useCategory'
import { useRecord } from '~/composables/useRecord'

const props = defineProps<{ rows: any[] }>()
const emit = defineEmits(['edit', 'delete'])

const { getCategoryName } = useCategory()
const { getTypeBackgroundClasses } = useRecord()
</script>
