<template>
  <UModal v-model="open">
    <UCard>
      <template #header>
        <span class="text-xl font-medium dark:text-white">
          {{ title || $t('common.confirmRemove') }}
        </span>
      </template>

      <div class="flex justify-between">
        <UButton @click="$emit('close')"> {{ $t('common.close') }} </UButton>
        <UButton color="red" @click="$emit('remove')">
          {{ $t('common.delete') }}
        </UButton>
      </div>
    </UCard>
  </UModal>
</template>

<script lang="ts">
export default {
  props: {
    isOpen: { type: Boolean },
    title: { type: String, default: '' },
  },
  emits: ['close', 'remove'],
  computed: {
    open: {
      get: (vm) => vm.isOpen,
      set() {
        this.$emit('close')
      },
    },
  },
}
</script>
