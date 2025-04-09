<script lang="ts" setup>
import dayjs from 'dayjs'
import InfiniteLoading from 'v3-infinite-loading'
import 'v3-infinite-loading/lib/style.css'

const props = defineProps<{ rows: any[] }>()
const emit = defineEmits(['edit', 'delete'])

const { getCategoryName, getCategory } = useCategory()
const { getTypeTextClasses } = useRecord()

const pageSize = 20
const page = ref(1)
const dataToShow = computed(() =>
  props.rows.filter((_, i) => i <= pageSize * page.value),
)

async function load($state) {
  if (pageSize * page.value >= props.rows.length) {
    $state.complete()
  }
  else {
    $state.loaded()
  }
  page.value++
}
</script>

<template>
  <ul
    v-auto-animate
    class="divide-y divide-gray-200 text-gray-900 dark:divide-gray-700 dark:text-white"
  >
    <li
      v-for="row of dataToShow"
      :key="row.id"
      class="sm:b-2 mb-2 flex flex-col justify-between p-1 px-3 sm:mb-3 sm:px-4"
    >
      <div class="mt-1 grid grid-cols-11 items-center">
        <div class="col-span-4 flex items-center">
          <UIcon v-if="getCategory(row.categoryId)?.icon" :name="getCategory(row.categoryId)?.icon" class="text-xl mr-2" />
          <span
            class=" truncate text-sm font-medium text-gray-900 dark:text-white"
          >
            {{ getCategoryName(row.categoryId) }}
          </span>
        </div>

        <span
          class="col-span-3 text-left text-sm text-gray-500 dark:text-gray-400"
        >
          {{ dayjs(row.timestamp).format("DD.MM.YYYY") }}
        </span>

        <span
          class="col-span-4 pr-1 text-right text-base font-semibold" :class="getTypeTextClasses(row.type)"
        >
          {{ numberWithSpaces(row.amount) }}
        </span>
      </div>

      <div class="grid grid-cols-11">
        <p
          v-if="row.comment"
          class="col-span-10 mt-2 text-sm text-gray-500 dark:text-gray-400"
        >
          {{ row.comment }}
        </p>

        <span v-else class="col-span-10" />

        <RecordsListDropdown
          class="col-span-1 justify-self-end"
          :record="row"
          @edit="emit('edit', $event)"
          @delete="emit('delete', $event)"
        />
      </div>
    </li>
  </ul>

  <InfiniteLoading @infinite="load" />
</template>
