<script lang="ts" setup>
import dayjs from 'dayjs'

const props = defineProps<{ rows: any[] }>()

const emit = defineEmits(['edit', 'delete'])

const { locale } = useI18n()
const { categoryStoreRefs: { costs, incoming } } = useCategoryStore()
const { getCategory } = useCategory()
const { getTypeTextClasses } = useRecord()
const { t } = useI18n()
dayjs.locale(locale.value)

const hoverId = ref<number | null>(null)
const date = ref(dayjs())
const isFiltersOpen = ref(false)
const isFilterActive = ref(false)
const categoryToFilter = ref<number[]>([])

function submitFilters() {
  isFilterActive.value = true
  isFiltersOpen.value = false
}

function resetFilters() {
  isFilterActive.value = false
  categoryToFilter.value = []
  isFiltersOpen.value = false
}

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
    if (itemDate.year() !== date.value.year() || itemDate.month() !== date.value.month()) {
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

function getDropDownItems(record: RecordResponseDto) {
  return [
    [
      {
        label: t('common.edit'),
        icon: 'i-heroicons-pencil-square-20-solid',
        onSelect: () => emit('edit', record),
      },
    ],
    [
      {
        label: t('common.delete'),
        icon: 'i-heroicons-trash-20-solid',
        onSelect: () => emit('delete', record),
      },
    ],
  ]
}
</script>

<template>
  <UDrawer v-model:open="isFiltersOpen" title="Фильтры">
    <div class="flex justify-end mb-2 pr-1">
      <UButton :color="isFilterActive ? 'primary' : 'neutral'" variant="link" trailing-icon="i-heroicons-funnel" />
    </div>

    <template #body>
      <div>
        <USelectMenu
          v-model="categoryToFilter"
          :placeholder="t('common.all')"
          multiple
          value-key="id"
          label-key="name"
          :items="[costs, incoming]"
          block
          class="w-full"
          size="xl"
        />
      </div>
    </template>

    <template #footer>
      <div class="grid grid-cols-2 gap-2">
        <UButton
          :label="t('common.reset')"
          color="neutral"
          variant="outline"
          size="xl"
          block
          @click="resetFilters"
        />
        <UButton
          :label="t('common.submit')"
          color="neutral"
          size="xl"
          block
          @click="submitFilters"
        />
      </div>
    </template>
  </UDrawer>

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

  <ul
    v-auto-animate
    class="text-gray-900 dark:text-white"
  >
    <template v-for="(row) in list" :key="row.id">
      <li v-if="row.isDate" class="mb-2 text-gray-500 dark:text-gray-400 text-sm px-3 py-2 border-b-2 border-gray-300 dark:border-gray-700">
        {{ row.date }}
      </li>

      <UContextMenu v-else :items="getDropDownItems(row)">
        <li class="border-b-1 border-gray-200 dark:border-gray-800 mb-2">
          <div
            class="mb-2 flex flex-col justify-between py-1 px-3 rounded-sm cursor-pointer duration-300 ease-in-out"
            :class="hoverId === row.id ? 'bg-slate-200 dark:bg-slate-800' : ''"
            @mouseenter="hoverId = row.id"
            @mouseleave="hoverId = null"
          >
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <UIcon
                  v-if="row.category?.icon"
                  :name="row.category?.icon"
                  class="text-xl mr-2"
                  :style="{ color: row.category.color }"
                />
                <span
                  class="truncate text-gray-900 dark:text-white"
                >
                  {{ row.category?.name }}
                </span>
              </div>

              <span
                class="pr-1 text-right text-base font-semibold" :class="getTypeTextClasses(row.type)"
              >
                {{ numberWithSpaces(row.amount) }}
              </span>
            </div>

            <div>
              <UBadge
                v-if="row.comment"
                :label="row.comment"
                color="neutral" variant="outline"
                class="mt-1"
              />
            </div>
          </div>
        </li>
      </UContextMenu>
    </template>
  </ul>
</template>
