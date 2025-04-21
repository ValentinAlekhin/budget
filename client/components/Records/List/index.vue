<script lang="ts" setup>
import dayjs from 'dayjs'
import InfiniteLoading from 'v3-infinite-loading'
import 'v3-infinite-loading/lib/style.css'

const props = defineProps<{ rows: any[] }>()

const emit = defineEmits(['edit', 'delete'])

dayjs.locale('ru')

const { getCategoryName, getCategory } = useCategory()
const { getTypeTextClasses } = useRecord()

const pageSize = 20
const page = ref(1)
const dataToShow = computed(() =>
  props.rows.filter((_, i) => i <= pageSize * page.value),
)
const list = computed(() => {
  let date = dayjs().year(0).date(0)

  return dataToShow.value.reduce((acc, item) => {
    const itemDate = dayjs(item.timestamp)
    if (itemDate.date() !== date.date()) {
      date = itemDate
      const formaterDate = itemDate.format('dddd, D MMMM')
      acc.push({ id: formaterDate, date: formaterDate, isDate: true })
    }
    acc.push(item)
    return acc
  }, [])
})

async function load(state) {
  if (pageSize * page.value >= props.rows.length) {
    state.complete()
  }
  else {
    state.loaded()
  }
  page.value++
}

const { t } = useI18n()

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
  <ul
    v-auto-animate
    class="text-gray-900 dark:text-white"
  >
    <template v-for="(row) in list" :key="row.id">
      <li v-if="row.isDate" class="mb-1 text-gray-500 dark:text-gray-400 text-xs px-3 divide-y-2 divide-gray-200 dark:divide-gray-700">
        {{ row.date }}
      </li>

      <UContextMenu v-else :items="getDropDownItems(row)">
        <li
          class="mb-2 flex flex-col justify-between py-1 px-3 hover:bg-slate-200 hover:dark:bg-slate-800 rounded-sm cursor-pointer"
        >
          <div class="flex justify-between items-center">
            <div class="flex items-center">
              <UIcon v-if="getCategory(row.categoryId)?.icon" :name="getCategory(row.categoryId)?.icon" class="text-xl mr-2" />
              <span
                class="truncate text-gray-900 dark:text-white"
              >
                {{ getCategoryName(row.categoryId) }}
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
        </li>
      </UContextMenu>
    </template>
  </ul>

  <InfiniteLoading @infinite="load" />
</template>
