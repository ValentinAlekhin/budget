<script lang="ts" setup>
import dayjs from 'dayjs'

const props = defineProps<{ rows: any[] }>()

const emit = defineEmits(['edit', 'delete'])

const { locale } = useI18n()
const { getCategory } = useCategory()

dayjs.locale(locale.value)

const date = ref(dayjs())
const isFiltersOpen = ref(false)
const isFilterActive = ref(false)
const categoryToFilter = ref<number[]>([])

function nextMonth() {
  date.value = date.value.add(1, 'month')
}

function prevMonth() {
  date.value = date.value.subtract(1, 'month')
}

const dateText = computed(() => {
  let format = 'MMMM'
  const currentYear = dayjs().year()
  if (currentYear !== date.value.year()) {
    format += ', YYYY'
  }

  return date.value.format(format)
})

const list = computed(() => {
  let tmpDate = dayjs().year(0).date(0)

  return props.rows.reduce((acc, item) => {
    if (isFilterActive.value) {
      if (!categoryToFilter.value.includes(item.categoryId)) {
        return acc
      }
    }

    const itemDate = dayjs(item.timestamp)
    if (
      itemDate.year() !== date.value.year()
      || itemDate.month() !== date.value.month()
    ) {
      return acc
    }

    if (itemDate.format('DD/MM/YYYY') !== tmpDate.format('DD/MM/YYYY')) {
      tmpDate = itemDate
      const formaterDate = itemDate.format('dddd, D MMMM')
      acc.push({ id: formaterDate, date: formaterDate, isDate: true })
    }

    const category = getCategory(item.categoryId)
    acc.push({ ...item, category })
    return acc
  }, [])
})
</script>

<template>
  <RecordsListFilter
    v-model:model-value="isFiltersOpen"
    v-model:is-filter-active="isFilterActive"
    v-model:category-to-filter="categoryToFilter"
  />

  <div class="mb-1 flex items-center justify-between">
    <UButton
      icon="i-heroicons-chevron-left"
      color="neutral"
      variant="link"
      size="xl"
      @click="prevMonth"
    />
    <span class="font-semibold capitalize">
      {{ dateText }}
    </span>
    <UButton
      icon="i-heroicons-chevron-right"
      color="neutral"
      variant="link"
      size="xl"
      @click="nextMonth"
    />
  </div>

  <ul v-auto-animate class="text-gray-900 dark:text-white">
    <template v-for="row in list" :key="row.id">
      <li
        v-if="row.isDate"
        class="mb-2 text-gray-500 dark:text-gray-400 text-sm px-3 py-2 border-b-2 border-gray-300 dark:border-gray-700"
      >
        {{ row.date }}
      </li>
      <RecordsListItem
        v-else
        :row="row"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
      />
    </template>
  </ul>
</template>
