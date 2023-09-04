<template>
  <UButton
    icon="i-heroicons-arrow-small-left"
    :ui="{ rounded: 'rounded-full' }"
    size="xs"
    :to="to"
    @click="$emit('click')"
  />
</template>

<script lang="ts">
export default {
  props: {
    to: {
      type: String,
      default: "",
    },
  },
  emits: ["click"],
};
</script>
