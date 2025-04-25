<script lang="ts" setup>
defineProps<{
  open: boolean
  active: boolean
  categoryToFilter: number[]
  tagsToFilter: number[]
}>()

const emit = defineEmits([
  'update:open',
  'update:active',
  'update:categoryToFilter',
  'update:tagsToFilter',
])

const { t } = useI18n()
const {
  categoryStoreRefs: { costs, incoming },
} = useCategoryStore()
const { tagStoreRefs: { data: tags } } = useTagStore()

function submitFilters() {
  emit('update:active', true)
  emit('update:open', false)
}

function resetFilters() {
  emit('update:active', false)
  emit('update:categoryToFilter', [])
  emit('update:tagsToFilter', [])
  emit('update:open', false)
}
</script>

<template>
  <UDrawer
    :open="open"
    title="Фильтры"
    @update:open="emit('update:open', $event)"
  >
    <div class="flex justify-end mb-2 pr-1">
      <UButton
        :color="active ? 'primary' : 'neutral'"
        variant="link"
        trailing-icon="i-heroicons-funnel"
      />
    </div>

    <template #body>
      <div>
        <USelectMenu
          :model-value="categoryToFilter"
          :placeholder="t('common.all')"
          multiple
          value-key="id"
          label-key="name"
          :items="[costs, incoming]"
          block
          class="w-full"
          size="xl"
          @update:model-value="emit('update:categoryToFilter', $event)"
        />

        <USelectMenu
          :model-value="tagsToFilter"
          :placeholder="t('common.all')"
          multiple
          value-key="id"
          label-key="name"
          :items="tags"
          block
          class="w-full mt-2"
          size="xl"
          @update:model-value="emit('update:tagsToFilter', $event)"
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
</template>
