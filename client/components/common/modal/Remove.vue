<template>
  <UModal v-model="open">
    <UCard>
      <template #header>
        <span class="text-xl font-medium dark:text-white">{{ title }}</span>
      </template>

      <div class="flex justify-between">
        <UButton @click="$emit('close')"> Close </UButton>
        <UButton color="red" @click="$emit('remove')"> Remove </UButton>
      </div>
    </UCard>
  </UModal>
</template>

<script lang="ts">
export default {
  props: {
    isOpen: { type: Boolean },
    title: { type: String, default: 'Confirm remove' },
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
