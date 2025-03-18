<script lang="ts" setup>
interface Props {
  open?: boolean
  title?: string
}

defineProps<Props>()
const emit = defineEmits(['close', 'remove'])

function close() {
  emit('close')
}
</script>

<template>
  <UModal :open="open" @update:open="close">
    <template #content>
      <UCard>
        <template #header>
          <span class="text-xl font-medium dark:text-white">
            {{ title || $t("common.confirmRemove") }}
          </span>
        </template>

        <div class="flex justify-between">
          <UButton @click="close">
            {{ $t("common.close") }}
          </UButton>
          <UButton color="red" @click="$emit('remove')">
            {{ $t("common.delete") }}
          </UButton>
        </div>
      </UCard>
    </template>
  </UModal>
</template>
