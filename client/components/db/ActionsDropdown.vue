<script lang="ts" setup>
const props = defineProps<{ record: any }>()
const emit = defineEmits(['edit', 'delete'])

const { t } = useI18n()

const isDropDownOpen = ref(false)

const items = computed(() => [
  [
    {
      label: t('common.edit'),
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => emit('edit', props.record),
    },
  ],
  [
    {
      label: t('common.delete'),
      icon: 'i-heroicons-trash-20-solid',
      click: () => emit('delete', props.record),
    },
  ],
])
</script>

<template>
  <UDropdown v-model:open="isDropDownOpen" :items="items">
    <UButton
      color="gray"
      variant="ghost"
      icon="i-heroicons-ellipsis-horizontal-20-solid"
      @touchstart.stop.prevent="isDropDownOpen = !isDropDownOpen"
    />
  </UDropdown>
</template>
