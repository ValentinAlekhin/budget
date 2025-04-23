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

        <div class="grid grid-cols-2 gap-2">
          <UButton
            color="neutral"
            size="xl"
            block
            @click="close"
          >
            {{ $t("common.cancel") }}
          </UButton>
          <UButton
            size="xl"
            block color="error"
            @click="$emit('remove')"
          >
            {{ $t("common.delete") }}
          </UButton>
        </div>
      </UCard>
    </template>
  </UModal>
</template>
