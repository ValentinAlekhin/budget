<template>
  <UDropdown :items="items">
    <UButton
      color="gray"
      variant="ghost"
      icon="i-heroicons-ellipsis-horizontal-20-solid"
    />
  </UDropdown>
</template>

<script lang="ts" setup>
const props = defineProps<{ record: any }>()
const emit = defineEmits(['edit', 'delete'])

const { t } = useI18n()

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
