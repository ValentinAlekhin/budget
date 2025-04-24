<script lang="ts" setup>
defineProps<{
  modelValue: boolean
  isFilterActive: boolean
  categoryToFilter: number[]
}>()

const emit = defineEmits([
  'update:modelValue',
  'update:isFilterActive',
  'update:categoryToFilter',
])

const { t } = useI18n()
const {
  categoryStoreRefs: { costs, incoming },
} = useCategoryStore()

function submitFilters() {
  emit('update:isFilterActive', true)
  emit('update:modelValue', false)
}

function resetFilters() {
  emit('update:isFilterActive', false)
  emit('update:categoryToFilter', [])
  emit('update:modelValue', false)
}
</script>

<template>
  <UDrawer
    :open="modelValue"
    title="Фильтры"
    @update:open="emit('update:modelValue', $event)"
  >
    <div class="flex justify-end mb-2 pr-1">
      <UButton
        :color="isFilterActive ? 'primary' : 'neutral'"
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
