<script lang="ts" setup>
const { row } = defineProps<{
  row: RecordResponseDto & { category?: any }
}>()

const emit = defineEmits(['edit', 'delete'])

const { getTypeTextClasses } = useRecord()
const { t } = useI18n()
const { tagStore: { getById: getTagById } } = useTagStore()

const isHovered = ref(false)

const tag = computed(() => row.tagId ? getTagById(row.tagId) : null)

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
  <UContextMenu :items="getDropDownItems(row)">
    <li
      class="border-b-1 border-gray-200 dark:border-gray-800 mb-2"
      @mouseenter="isHovered = true" @mouseleave="isHovered = false"
    >
      <div
        class="mb-2 flex flex-col justify-between py-1 px-3 rounded-sm cursor-pointer duration-300 ease-in-out"
        :class="isHovered ? 'bg-slate-200 dark:bg-slate-800' : ''"
      >
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <UIcon
              v-if="row.category?.icon"
              :name="row.category?.icon"
              class="text-xl mr-2"
              :style="{ color: row.category.color }"
            />
            <span class="truncate text-gray-900 dark:text-white">
              {{ row.category?.name }}
            </span>
          </div>

          <FinanceValue
            :value="row.amount"
            class="pr-1 text-right text-base font-semibold"
            :class="getTypeTextClasses(row.type)"
          />
        </div>

        <div v-if="tag || row.comment" class="mt-1 flex items-center">
          <TagItem
            v-if="tag"
            :name="tag.name"
            :color="tag.color"
            :icon="tag.icon"
            class="mr-2"
          />
          <UBadge
            v-if="row.comment"
            :label="row.comment"
            color="neutral"
            variant="soft"
          />
        </div>
      </div>
    </li>
  </UContextMenu>
</template>
