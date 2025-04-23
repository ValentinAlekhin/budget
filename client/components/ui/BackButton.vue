<script lang="ts">
export default {
  props: {
    to: {
      type: String,
      default: '',
    },
  },
  emits: ['click'],
}
</script>

<template>
  <UButton
    icon="i-heroicons-arrow-small-left"
    class="rounded-md"
    size="sm"
    :to="to"
    @click="$emit('click')"
  />
</template>
